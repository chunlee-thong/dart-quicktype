// @ts-nocheck

import { arrayIntercalate } from "collection-utils";
import { StringTypeMapping } from "quicktype-core";
import { anyTypeIssueAnnotation, nullTypeIssueAnnotation } from "quicktype-core/dist/Annotation";
import { ConvenienceRenderer, ForbiddenWordsInfo } from "quicktype-core/dist/ConvenienceRenderer";
import { DependencyName, Name, Namer, funPrefixNamer } from "quicktype-core/dist/Naming";
import { RenderContext } from "quicktype-core/dist/Renderer";
import {
  BooleanOption,
  Option,
  OptionValues,
  StringOption,
  getOptionValues,
} from "quicktype-core/dist/RendererOptions";
import { Sourcelike, maybeAnnotated } from "quicktype-core/dist/Source";
import { TargetLanguage } from "quicktype-core/dist/TargetLanguage";
import {
  ClassProperty,
  ClassType,
  EnumType,
  PrimitiveStringTypeKind,
  TransformedStringTypeKind,
  Type,
  UnionType,
} from "quicktype-core/dist/Type";
import {
  directlyReachableSingleNamedType,
  matchType,
  nullableFromUnion,
} from "quicktype-core/dist/TypeUtils";
import {
  allLowerWordStyle,
  allUpperWordStyle,
  combineWords,
  escapeNonPrintableMapper,
  firstUpperWordStyle,
  isAscii,
  isDigit,
  isLetter,
  isPrintable,
  splitIntoWords,
  standardUnicodeHexEscape,
  utf16ConcatMap,
  utf16LegalizeCharacters,
} from "quicktype-core/dist/support/Strings";
import { defined } from "quicktype-core/dist/support/Support";
import { ClassOption, CustomDartOption } from ".";

export const quicktypeDartOptions = {
  justTypes: new BooleanOption("just-types", "Types only", false),
  codersInClass: new BooleanOption("coders-in-class", "Put encoder & decoder in Class", false),
  methodNamesWithMap: new BooleanOption("from-map", "Use method names fromMap() & toMap()", false),
  requiredProperties: new BooleanOption("required-props", "Make all properties required", true),
  finalProperties: new BooleanOption("final-props", "Make all properties final", true),
  generateCopyWith: new BooleanOption("copy-with", "Generate CopyWith method", true),
  useFreezed: new BooleanOption(
    "use-freezed",
    "Generate class definitions with @freezed compatibility",
    false
  ),
  useHive: new BooleanOption("use-hive", "Generate annotations for Hive type adapters", false),
  partName: new StringOption("part-name", "Use this name in `part` directive", "NAME", "filename"),
};

// function snakeCase(str: string): string {
//   const words = splitIntoWords(str).map(({ word }) => word.toLowerCase());
//   return words.join("_");
// }

export class CustomDartTargetLanguage extends TargetLanguage {
  customDartOptions: CustomDartOption;
  classOptions: ClassOption;
  constructor(customDartOptions: CustomDartOption, classOptions: ClassOption) {
    super("Dart", ["dart"], "dart");
    this.customDartOptions = customDartOptions;
    this.classOptions = classOptions;
  }

  protected getOptions(): Option<any>[] {
    return [
      quicktypeDartOptions.justTypes,
      quicktypeDartOptions.codersInClass,
      quicktypeDartOptions.methodNamesWithMap,
      quicktypeDartOptions.requiredProperties,
      quicktypeDartOptions.finalProperties,
      quicktypeDartOptions.generateCopyWith,
      quicktypeDartOptions.useFreezed,
      quicktypeDartOptions.useHive,
      quicktypeDartOptions.partName,
    ];
  }

  get supportsUnionsWithBothNumberTypes(): boolean {
    return true;
  }

  get stringTypeMapping(): StringTypeMapping {
    const mapping: Map<TransformedStringTypeKind, PrimitiveStringTypeKind> = new Map();
    mapping.set("date", "date");
    mapping.set("date-time", "date-time");
    //        mapping.set("uuid", "uuid");
    return mapping;
  }

  protected makeRenderer(
    renderContext: RenderContext,
    untypedOptionValues: { [name: string]: any }
  ): DartRenderer {
    const options = getOptionValues(quicktypeDartOptions, untypedOptionValues);
    return new CustomDartRenderer(
      this,
      renderContext,
      options,
      this.customDartOptions,
      this.classOptions
    );
  }
}

const keywords = [
  "abstract",
  "do",
  "import",
  "super",
  "as",
  "dynamic",
  "in",
  "switch",
  "assert",
  "else",
  "interface",
  "sync*",
  "async",
  "enum",
  "is",
  "this",
  "async*",
  "export",
  "library",
  "throw",
  "await",
  "external",
  "mixin",
  "true",
  "break",
  "extends",
  "new",
  "try",
  "case",
  "factory",
  "null",
  "typedef",
  "catch",
  "false",
  "operator",
  "var",
  "class",
  "final",
  "part",
  "void",
  "const",
  "finally",
  "rethrow",
  "while",
  "continue",
  "for",
  "return",
  "with",
  "covariant",
  "get",
  "set",
  "yield",
  "default",
  "if",
  "static",
  "yield*",
  "deferred",
  "implements",
  "int",
  "double",
  "bool",
  "Map",
  "List",
  "String",
  "File",
  "fromJson",
  "toJson",
  "fromMap",
  "toMap",
];

const typeNamingFunction = funPrefixNamer("types", (n) => dartNameStyle(true, false, n));
const propertyNamingFunction = funPrefixNamer("properties", (n) => dartNameStyle(false, false, n));
const enumCaseNamingFunction = funPrefixNamer("enum-cases", (n) => dartNameStyle(true, true, n));

// Escape the dollar sign, which is used in string interpolation
const stringEscape = utf16ConcatMap(
  escapeNonPrintableMapper((cp) => isPrintable(cp) && cp !== 0x24, standardUnicodeHexEscape)
);

function isStartCharacter(codePoint: number): boolean {
  if (codePoint === 0x5f) return false; // underscore
  return isAscii(codePoint) && isLetter(codePoint);
}

function isPartCharacter(codePoint: number): boolean {
  return isStartCharacter(codePoint) || (isAscii(codePoint) && isDigit(codePoint));
}

const legalizeName = utf16LegalizeCharacters(isPartCharacter);

// FIXME: Handle acronyms consistently.  In particular, that means that
// we have to use namers to produce the getter and setter names - we can't
// just capitalize and concatenate.
// https://stackoverflow.com/questions/8277355/naming-convention-for-upper-case-abbreviations
function dartNameStyle(
  startWithUpper: boolean,
  upperUnderscore: boolean,
  original: string
): string {
  const words = splitIntoWords(original);
  const firstWordStyle = upperUnderscore
    ? allUpperWordStyle
    : startWithUpper
    ? firstUpperWordStyle
    : allLowerWordStyle;
  const restWordStyle = upperUnderscore ? allUpperWordStyle : firstUpperWordStyle;
  return combineWords(
    words,
    legalizeName,
    firstWordStyle,
    restWordStyle,
    firstWordStyle,
    restWordStyle,
    upperUnderscore ? "_" : "",
    isStartCharacter
  );
}

type TopLevelDependents = {
  encoder: Name;
  decoder: Name;
};

export class CustomDartRenderer extends ConvenienceRenderer {
  private readonly _gettersAndSettersForPropertyName = new Map<Name, [Name, Name]>();
  private _needEnumValues = false;
  private readonly _topLevelDependents = new Map<Name, TopLevelDependents>();
  private readonly _enumValues = new Map<EnumType, Name>();

  private readonly customDartOptions: CustomDartOption;
  private readonly classOptions: ClassOption;

  constructor(
    targetLanguage: TargetLanguage,
    renderContext: RenderContext,
    private readonly _oldOptions: OptionValues<typeof quicktypeDartOptions>,
    customDartOptions: CustomDartOption,
    classOptions: ClassOption
  ) {
    super(targetLanguage, renderContext);
    this.customDartOptions = customDartOptions;
    this.classOptions = classOptions;
  }

  protected forbiddenNamesForGlobalNamespace(): string[] {
    return keywords;
  }

  protected forbiddenForObjectProperties(_c: ClassType, _className: Name): ForbiddenWordsInfo {
    return { names: [], includeGlobalForbidden: true };
  }

  protected makeNamedTypeNamer(): Namer {
    return typeNamingFunction;
  }

  protected namerForObjectProperty(): Namer {
    return propertyNamingFunction;
  }

  protected makeUnionMemberNamer(): Namer {
    return propertyNamingFunction;
  }

  protected makeEnumCaseNamer(): Namer {
    return enumCaseNamingFunction;
  }

  protected unionNeedsName(u: UnionType): boolean {
    return nullableFromUnion(u) === null;
  }

  protected namedTypeToNameForTopLevel(type: Type): Type | undefined {
    // If the top-level type doesn't contain any classes or unions
    // we have to define a class just for the `FromJson` method, in
    // emitFromJsonForTopLevel.
    return directlyReachableSingleNamedType(type);
  }

  protected get toJson(): string {
    return `to${this._oldOptions.methodNamesWithMap ? "Map" : "Json"}`;
  }

  protected get fromJson(): string {
    return `from${this._oldOptions.methodNamesWithMap ? "Map" : "Json"}`;
  }

  protected makeTopLevelDependencyNames(_t: Type, name: Name): DependencyName[] {
    const encoder = new DependencyName(
      propertyNamingFunction,
      name.order,
      (lookup) => `${lookup(name)}_${this.toJson}`
    );
    const decoder = new DependencyName(
      propertyNamingFunction,
      name.order,
      (lookup) => `${lookup(name)}_${this.fromJson}`
    );
    this._topLevelDependents.set(name, { encoder, decoder });
    return [encoder, decoder];
  }

  protected makeNamesForPropertyGetterAndSetter(
    _c: ClassType,
    _className: Name,
    _p: ClassProperty,
    _jsonName: string,
    name: Name
  ): [Name, Name] {
    const getterName = new DependencyName(
      propertyNamingFunction,
      name.order,
      (lookup) => `get_${lookup(name)}`
    );
    const setterName = new DependencyName(
      propertyNamingFunction,
      name.order,
      (lookup) => `set_${lookup(name)}`
    );
    return [getterName, setterName];
  }

  protected makePropertyDependencyNames(
    c: ClassType,
    className: Name,
    p: ClassProperty,
    jsonName: string,
    name: Name
  ): Name[] {
    const getterAndSetterNames = this.makeNamesForPropertyGetterAndSetter(
      c,
      className,
      p,
      jsonName,
      name
    );
    this._gettersAndSettersForPropertyName.set(name, getterAndSetterNames);
    return getterAndSetterNames;
  }

  protected makeNamedTypeDependencyNames(t: Type, name: Name): DependencyName[] {
    if (!(t instanceof EnumType)) return [];
    const enumValue = new DependencyName(
      propertyNamingFunction,
      name.order,
      (lookup) => `${lookup(name)}_values`
    );
    this._enumValues.set(t, enumValue);
    return [enumValue];
  }

  protected emitFileHeader(): void {
    this.ensureBlankLine();
  }

  protected emitBlock(line: Sourcelike, f: () => void): void {
    this.emitLine(line, " {");
    this.indent(f);
    this.emitLine("}");
  }

  protected dartType(t: Type, withIssues: boolean = false): Sourcelike {
    let useNumber = this.customDartOptions.useNum;

    return matchType<Sourcelike>(
      t,
      (_anyType) => maybeAnnotated(withIssues, anyTypeIssueAnnotation, "dynamic"),
      (_nullType) => maybeAnnotated(withIssues, nullTypeIssueAnnotation, "dynamic"),
      (_boolType) => "bool",
      (_integerType) => {
        return useNumber ? "num" : "int";
      },
      (_doubleType) => {
        return useNumber ? "num" : "double";
      },
      (_stringType) => "String",
      (arrayType) => ["List<", this.dartType(arrayType.items, withIssues), ">"],
      (classType) => {
        return this.nameForNamedType(classType);
      },
      (mapType) => ["Map<String, ", this.dartType(mapType.values, withIssues), ">"],
      (enumType) => this.nameForNamedType(enumType),
      (unionType) => {
        const maybeNullable = nullableFromUnion(unionType);
        if (maybeNullable === null) {
          return "dynamic";
        }
        return this.dartType(maybeNullable, withIssues);
      },
      (transformedStringType) => {
        switch (transformedStringType.kind) {
          case "date-time":
          case "date":
            return "DateTime";
          default:
            return "String";
        }
      }
    );
  }

  protected mapList(
    itemType: Sourcelike,
    list: Sourcelike,
    mapper: Sourcelike,
    toJson: boolean
  ): Sourcelike {
    if (toJson) {
      return [list, ".map((x) => ", mapper, ")", ".toList()"];
    }
    return [
      list,
      " == null ? [] : ",
      "List<",
      itemType,
      ">.from(",
      list,
      "!.map((x) => ",
      mapper,
      "))",
    ];
  }

  protected mapMap(valueType: Sourcelike, map: Sourcelike, valueMapper: Sourcelike): Sourcelike {
    return [
      "Map.from(",
      map,
      ").map((k, v) => MapEntry<String, ",
      valueType,
      ">(k, ",
      valueMapper,
      "))",
    ];
  }

  protected fromDynamicExpression(t: Type, ...dynamic: Sourcelike[]): Sourcelike {
    return matchType<Sourcelike>(
      t,
      (_anyType) => dynamic,
      (_nullType) => dynamic,
      (_boolType) => dynamic,
      (_integerType) => dynamic,
      (_doubleType) => [dynamic],
      (_stringType) => dynamic,
      (arrayType) =>
        this.mapList(
          this.dartType(arrayType.items),
          dynamic,
          this.fromDynamicExpression(arrayType.items, "x"),
          false
        ),
      (classType) => [this.nameForNamedType(classType), ".", this.fromJson, "(", dynamic, ")"],
      (mapType) =>
        this.mapMap(
          this.dartType(mapType.values),
          dynamic,
          this.fromDynamicExpression(mapType.values, "v")
        ),
      (enumType) => [defined(this._enumValues.get(enumType)), ".map[", dynamic, "]"],
      (unionType) => {
        const maybeNullable = nullableFromUnion(unionType);
        if (maybeNullable === null) {
          return dynamic;
        }

        const type = this.dartType(t, true);
        let isAClass = false;
        let hasDefaultValue =
          !Array.isArray(type) && type !== "DateTime" && this.customDartOptions.useDefaultValue;
        let defaultValue = null;
        if (typeof type == "object") {
          let isArray = Array.isArray(type);
          isAClass = !isArray && type["kind"] !== "annotated";
        }
        if (hasDefaultValue) {
          defaultValue = this.getDefaultValueForType(type);
        }
        return isAClass
          ? [dynamic, " == null ? null : ", this.fromDynamicExpression(maybeNullable, dynamic)]
          : hasDefaultValue
          ? [this.fromDynamicExpression(maybeNullable, dynamic, ` ?? ${defaultValue}`)]
          : [this.fromDynamicExpression(maybeNullable, dynamic)];
      },
      (transformedStringType) => {
        switch (transformedStringType.kind) {
          case "date-time":
          case "date":
            return ["DateTime.tryParse(", dynamic, ` ?? ""`, ")"];
          default:
            return dynamic;
        }
      }
    );
  }

  protected getDefaultValueForType(type): any {
    switch (type) {
      case "int":
        return 0;
      case "num":
        return 0;
      case "double":
        return `0.0`;
      case "String":
        return `""`;
      case "bool":
        return false;
      default:
        "";
    }
  }

  protected toDynamicExpression(t: Type, ...dynamic: Sourcelike[]): Sourcelike {
    return matchType<Sourcelike>(
      t,
      (_anyType) => dynamic,
      (_nullType) => dynamic,
      (_boolType) => dynamic,
      (_integerType) => dynamic,
      (_doubleType) => dynamic,
      (_stringType) => dynamic,
      (arrayType) =>
        this.mapList(
          this.dartType(arrayType.items),
          dynamic,
          this.toDynamicExpression(arrayType.items, "x"),
          true
        ),
      (_classType) => [dynamic, "?.", this.toJson, "()"],
      (mapType) => this.mapMap("dynamic", dynamic, this.toDynamicExpression(mapType.values, "v")),
      (enumType) => [defined(this._enumValues.get(enumType)), ".reverse[", dynamic, "]"],
      (unionType) => {
        const maybeNullable = nullableFromUnion(unionType);
        if (maybeNullable === null) {
          return dynamic;
        }
        return [this.toDynamicExpression(maybeNullable, dynamic)];
      },
      (transformedStringType) => {
        switch (transformedStringType.kind) {
          case "date-time":
            return [dynamic, "?.toIso8601String()"];
          case "date":
            return [
              '"${',
              dynamic,
              ".year.toString().padLeft(4, '0')",
              "}-${",
              dynamic,
              ".month.toString().padLeft(2, '0')}-${",
              dynamic,
              ".day.toString().padLeft(2, '0')}\"",
            ];
          default:
            return dynamic;
        }
      }
    );
  }

  protected numTypeReplacement(type: Sourcelike, jsonName: string): Sourcelike {
    if (type == "num") {
      var jsonNameParts = jsonName.split("_");
      if (jsonNameParts.includes("id")) {
        return "int";
      }
      if (jsonNameParts.includes("lat") || jsonName.includes("latitude")) {
        return "double";
      }
      if (jsonNameParts.includes("lng") || jsonName.includes("longitude")) {
        return "double";
      }
    }
    return type;
  }

  protected emitClassDefinition(c: ClassType, className: Name): void {
    var ignoreClasses = this.classOptions.ignoreClasses.split(",");

    var jsonName = className.firstProposedName();
    const realClassName = className.namingFunction.nameStyle(jsonName);

    if (ignoreClasses.includes(realClassName)) {
      return;
    }
    this.emitDescription(this.descriptionForType(c));
    if (this.customDartOptions.useSerializable) {
      this.emitLine(
        "@JsonSerializable(",
        !this.customDartOptions.generateToJson ? "createToJson: false" : "",
        ")"
      );
    }

    var hasNoProperty = c.getProperties().size === 0 && !this.customDartOptions.useSerializable;

    this.emitBlock(
      this.customDartOptions.useEquatable
        ? ["class ", className, " extends Equatable"]
        : ["class ", className],
      () => {
        if (hasNoProperty) {
          this.emitLine(className, "({required this.json});");
        } else {
          if (c.getProperties().size !== 0) {
            this.emitLine(className, "({");
            this.indent(() => {
              this.forEachClassProperty(c, "none", (name, _, _p) => {
                this.emitLine(
                  this._oldOptions.requiredProperties ? "required " : "",
                  "this.",
                  name,
                  ","
                );
              });
            });
            this.emitLine("});");
          } else {
            this.emitLine(className, "();");
          }
          this.ensureBlankLine();

          this.forEachClassProperty(c, "none", (name, jsonName, property) => {
            const description = this.descriptionForClassProperty(c, jsonName);

            if (
              this.customDartOptions.useSerializable &&
              jsonName !== name.namingFunction.nameStyle(jsonName)
            ) {
              this.ensureBlankLine();
              this.emitLine("@JsonKey(name: '", jsonName, "') ");
            }

            if (description !== undefined) {
              this.emitDescription(description);
            }
            let type = this.dartType(property.type, true);

            //
            const isDynamic = typeof type == "object" && type["kind"] === "annotated";
            const isAClass = typeof type == "object";
            const isDateTime = type == "DateTime";
            const isArray = Array.isArray(type);

            let letBeNull = false;
            if (isDynamic || (!this.customDartOptions.useSerializable && isArray)) {
              letBeNull = false;
            } else if (isAClass || isDateTime) {
              letBeNull = true;
            } else {
              letBeNull = this.customDartOptions.useDefaultValue == false;
            }
            type = this.numTypeReplacement(type, jsonName);
            this.emitLine(
              this._oldOptions.finalProperties ? "final " : "",
              type,
              letBeNull ? "? " : " ",
              name,
              ";"
            );
            if (this.customDartOptions.generateKey) {
              this.emitLine(`static const String `, name, `Key`, ` = "${jsonName}";`, "\n");
            }
          });
        }

        if (this.customDartOptions.generateCopyWith && !hasNoProperty) {
          this.ensureBlankLine();
          if (c.getProperties().size === 0) {
            this.emitLine(className, " copyWith(){");
          } else {
            this.emitLine(className, " copyWith({");
            this.indent(() => {
              this.forEachClassProperty(c, "none", (name, jsonName, _p) => {
                let type = this.dartType(_p.type, true, true);
                type = this.numTypeReplacement(type, jsonName);
                this.emitLine(type, "? ", name, ",");
              });
            });
            this.emitLine("}) {");
          }
          this.indent(() => {
            this.emitLine("return ", className, "(");
            this.indent(() => {
              this.forEachClassProperty(c, "none", (name, jsonName, _p) => {
                this.emitLine(name, ": ", name, " ?? ", "this.", name, ",");
              });
            });
            this.emitLine(");");
          });
          this.emitLine("}");
          this.ensureBlankLine();
        }

        if (this.customDartOptions.useSerializable) {
          this.ensureBlankLine();
          this.emitLine(
            "factory ",
            className,
            ".",
            this.fromJson,
            //TODO: make this json nullable
            "(Map<String, dynamic> json) => _$",
            className,
            "FromJson(json);"
          );
        } else {
          if (hasNoProperty) {
            this.emitLine("final Map<String,dynamic> json;");
          }
          this.ensureBlankLine();
          this.emitLine(
            "factory ",
            className,
            ".",
            this.fromJson,
            //TODO: make this json nullable
            "(Map<String, dynamic> json){ "
          );
          this.indent(() => {
            this.emitLine("return ", className, "(");
            if (hasNoProperty) {
              this.emitLine("json: json");
            }
          });
          this.indent(() => {
            this.indent(() => {
              this.forEachClassProperty(c, "none", (name, jsonName, property) => {
                this.emitLine(
                  name,
                  ": ",
                  this.fromDynamicExpression(property.type, 'json["', stringEscape(jsonName), '"]'),
                  ","
                );
              });
            });
          });
          this.indent(() => {
            this.emitLine(");");
          });
          this.emitLine("}");
        }
        this.ensureBlankLine();
        if (this.customDartOptions.generateToJson) {
          if (this.customDartOptions.useSerializable) {
            this.ensureBlankLine();

            this.emitLine(
              "Map<String, dynamic> ",
              this.toJson,
              "() => _$",
              className,
              "ToJson(this);"
            );
          } else {
            this.emitLine("Map<String, dynamic> ", this.toJson, "() => {");
            this.indent(() => {
              this.forEachClassProperty(c, "none", (name, jsonName, property) => {
                this.emitLine(
                  '"',
                  stringEscape(jsonName),
                  '": ',
                  this.toDynamicExpression(property.type, name),
                  ","
                );
              });
            });
            this.emitLine("};");
          }
        }
        this.ensureBlankLine();
        //Generate toString method
        if (this.customDartOptions.generateToString) {
          this.ensureBlankLine();
          this.emitLine("@override");
          this.emitLine("String toString(){");
          let data = `    return "`;
          this.indent(() => {
            this.forEachClassProperty(c, "none", (name, jsonName, property) => {
              data += "$" + this.sourcelikeToString(name) + ", ";
            });
            return data;
          });
          this.emitLine(data, `";`);
          this.emitLine("}");
        }
        //Generate Equatable Props
        if (this.customDartOptions.useEquatable) {
          let data = "";
          this.ensureBlankLine();
          this.emitLine("@override");
          this.emitLine("List<Object?> get props => [");
          this.indent(() => {
            this.forEachClassProperty(c, "none", (name, jsonName, property) => {
              data += this.sourcelikeToString(name) + ", ";
            });
            return data;
          });
          this.emitLine(data, "];");
        }

        if (this.customDartOptions.generateJsonComment) {
          this.ensureBlankLine();
        }
      }
    );
  }

  protected emitEnumDefinition(e: EnumType, enumName: Name): void {
    const caseNames: Sourcelike[] = Array.from(e.cases).map((c) => this.nameForEnumCase(e, c));
    this.emitDescription(this.descriptionForType(e));
    this.emitLine("enum ", enumName, " { ", arrayIntercalate(", ", caseNames), " }");

    if (this._oldOptions.justTypes) return;

    this.ensureBlankLine();
    this.emitLine("final ", defined(this._enumValues.get(e)), " = EnumValues({");
    this.indent(() => {
      this.forEachEnumCase(e, "none", (name, jsonName, pos) => {
        const comma = pos === "first" || pos === "middle" ? "," : [];
        this.emitLine('"', stringEscape(jsonName), '": ', enumName, ".", name, comma);
      });
    });
    this.emitLine("});");

    this._needEnumValues = true;
  }

  protected emitEnumValues(): void {
    this.ensureBlankLine();
    this.emitMultiline(`class EnumValues<T> {
    Map<String, T> map;
    Map<T, String> reverseMap;

    EnumValues(this.map);

    Map<T, String> get reverse {
        if (reverseMap == null) {
            reverseMap = map.map((k, v) => new MapEntry(v, k));
        }
        return reverseMap;
    }
}`);
  }

  protected emitSourceStructure(): void {
    this.emitFileHeader();
    if (!this._oldOptions.justTypes && !this._oldOptions.codersInClass) {
    }

    const headers = this.classOptions.headers;
    if (headers.trim().length > 0) {
      this.emitLine(headers);
    }

    if (this.customDartOptions.useEquatable) {
      this.emitLine("import 'package:equatable/equatable.dart';");
    }

    if (this.customDartOptions.useSerializable) {
      this.emitLine("import 'package:json_annotation/json_annotation.dart';");
      this.ensureBlankLine();
      this.emitLine("part '", this._oldOptions.partName, ".g.dart';"); //todo print part
    }

    this.forEachNamedType(
      "leading-and-interposing",
      (c: ClassType, n: Name) =>
        this._oldOptions.useFreezed
          ? this.emitFreezedClassDefinition(c, n)
          : this.emitClassDefinition(c, n),
      (e, n) => this.emitEnumDefinition(e, n),
      (_e, _n) => {
        // We don't support this yet.
      }
    );

    if (this._needEnumValues) {
      this.emitEnumValues();
    }
  }
}
