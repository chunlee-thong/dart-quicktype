// @ts-nocheck

import { arrayIntercalate } from "collection-utils";
import { StringTypeMapping } from "quicktype-core";
import { anyTypeIssueAnnotation, nullTypeIssueAnnotation } from "quicktype-core/dist/Annotation";
import { ConvenienceRenderer, ForbiddenWordsInfo } from "quicktype-core/dist/ConvenienceRenderer";
import { DependencyName, funPrefixNamer, Name, Namer } from "quicktype-core/dist/Naming";
import { RenderContext } from "quicktype-core/dist/Renderer";
import {
  BooleanOption,
  getOptionValues,
  Option,
  OptionValues,
  StringOption
} from "quicktype-core/dist/RendererOptions";
import { maybeAnnotated, Sourcelike } from "quicktype-core/dist/Source";
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
  utf16LegalizeCharacters
} from "quicktype-core/dist/support/Strings";
import { defined } from "quicktype-core/dist/support/Support";
import { TargetLanguage } from "quicktype-core/dist/TargetLanguage";
import {
  ClassProperty,
  ClassType,
  EnumType,
  PrimitiveStringTypeKind,
  TransformedStringTypeKind,
  Type,
  UnionType
} from "quicktype-core/dist/Type";
import {
  directlyReachableSingleNamedType,
  matchType,
  nullableFromUnion
} from "quicktype-core/dist/TypeUtils";
import { CustomDartOption } from ".";

export const dartOptions = {
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
  partName: new StringOption("part-name", "Use this name in `part` directive", "NAME", ""),
};

// function snakeCase(str: string): string {
//   const words = splitIntoWords(str).map(({ word }) => word.toLowerCase());
//   return words.join("_");
// }

export class CustomDartTargetLanguage extends TargetLanguage {

  customDartOptions: CustomDartOption;
  constructor(customDartOptions: CustomDartOption) {
    super("Dart", ["dart"], "dart");
    this.customDartOptions = customDartOptions
  }

  protected getOptions(): Option<any>[] {
    return [
      dartOptions.justTypes,
      dartOptions.codersInClass,
      dartOptions.methodNamesWithMap,
      dartOptions.requiredProperties,
      dartOptions.finalProperties,
      dartOptions.generateCopyWith,
      dartOptions.useFreezed,
      dartOptions.useHive,
      dartOptions.partName,
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
    const options = getOptionValues(dartOptions, untypedOptionValues);
    return new CustomDartRenderer(this, renderContext, options, this.customDartOptions);
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

  private readonly customDartOption: CustomDartOption

  constructor(
    targetLanguage: TargetLanguage,
    renderContext: RenderContext,
    private readonly _options: OptionValues<typeof dartOptions>,
    customDartOption: CustomDartOption,
  ) {
    super(targetLanguage, renderContext);
    this.customDartOption = customDartOption;
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
    return `to${this._options.methodNamesWithMap ? "Map" : "Json"}`;
  }

  protected get fromJson(): string {
    return `from${this._options.methodNamesWithMap ? "Map" : "Json"}`;
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

  protected dartType(t: Type, withIssues: boolean = false, nullable: boolean = false): Sourcelike {
    return matchType<Sourcelike>(
      t,
      (_anyType) => maybeAnnotated(withIssues, anyTypeIssueAnnotation, "dynamic"),
      (_nullType) => maybeAnnotated(withIssues, nullTypeIssueAnnotation, "dynamic"),
      (_boolType) => "bool",
      (_integerType) => "int",
      (_doubleType) => "double",
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

  protected mapList(itemType: Sourcelike, list: Sourcelike, mapper: Sourcelike): Sourcelike {
    return [list, " == null ? [] : ", "List<", itemType, ">.from(", list, "!.map((x) => ", mapper, "))"];
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
          this.fromDynamicExpression(arrayType.items, "x")
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
        let hasDefaultValue = !Array.isArray(type) && type !== "DateTime" && this.customDartOption.useDefaultValue;
        let defaultValue = null;
        if (typeof type == 'object') {
          let isArray = Array.isArray(type);
          isAClass = !isArray && type["kind"] !== "annotated";
        }
        if (hasDefaultValue) {
          defaultValue = this.getDefaultValueForType(type);
        }
        return isAClass ?
          [dynamic, " == null ? null : ", this.fromDynamicExpression(maybeNullable, dynamic)]
          : hasDefaultValue ?
            [this.fromDynamicExpression(maybeNullable, dynamic, ` ?? ${defaultValue}`)]
            : [this.fromDynamicExpression(maybeNullable, dynamic)]
      },
      (transformedStringType) => {
        switch (transformedStringType.kind) {
          case "date-time":
          case "date":
            return [dynamic, " == null ? null : ", "DateTime.parse(", dynamic, ")"];
          default:
            return dynamic;
        }
      }
    );
  }

  protected getDefaultValueForType(type): any {
    switch (type) {
      case "int": return 0; case "double": return `0.toDouble()`; case "String": return `""`; case "bool": return false; default: ""
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
        this.mapList("dynamic", dynamic, this.toDynamicExpression(arrayType.items, "x")),
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

  protected emitClassDefinition(c: ClassType, className: Name): void {
    this.emitDescription(this.descriptionForType(c));
    this.emitBlock(["class ", className], () => {
      if (c.getProperties().size === 0) {
        this.emitLine(className, "();");
      } else {
        this.emitLine(className, "({");
        this.indent(() => {
          this.forEachClassProperty(c, "none", (name, _, _p) => {
            this.emitLine(this._options.requiredProperties ? "required " : "", "this.", name, ",");
          });
        });
        this.emitLine("});");
        this.ensureBlankLine();

        this.forEachClassProperty(c, "none", (name, jsonName, property) => {
          const description = this.descriptionForClassProperty(c, jsonName);
          if (description !== undefined) {
            this.emitDescription(description);
          }
          const type = this.dartType(property.type, true);
          //
          const isDynamic = typeof type == 'object' && type["kind"] === "annotated";
          const isAClass = typeof type == 'object';
          const isDateTime = type == 'DateTime';
          const isArray = Array.isArray(type);

          let letBeNull = false;
          if (isDynamic || isArray) {
            letBeNull = false;
          } else if (isAClass || isDateTime) {
            letBeNull = true;
          } else {
            letBeNull = this.customDartOption.useDefaultValue == false;
          }

          this.emitLine(
            this._options.finalProperties ? "final " : "",
            type,
            letBeNull ? "? " : " ",
            name,
            ";"
          );
        });
      }

      if (this.customDartOption.generateCopyWith) {
        this.ensureBlankLine();
        this.emitLine(className, " copyWith({");
        this.indent(() => {
          this.forEachClassProperty(c, "none", (name, _, _p) => {
            this.emitLine(this.dartType(_p.type, true, true), "? ", name, ",");
          });
        });
        this.emitLine("}) {");
        this.indent(() => {
          this.emitLine("return ", className, "(");
          this.indent(() => {
            this.forEachClassProperty(c, "none", (name, _, _p) => {
              this.emitLine(name, ": ", name, " ?? ", "this.", name, ",");
            });
          });
          this.emitLine(");");
          this.emitLine("}");
          this.ensureBlankLine();
        });
      }
      this.ensureBlankLine();
      this.emitLine(
        "factory ",
        className,
        ".",
        this.fromJson,
        //TODO: make this json nullable
        "(Map<String, dynamic> json){ ",
      );
      this.indent(() => {
        this.emitLine(
          "return ",
          className,
          "("
        );
      })
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
      this.emitLine(");");
      this.emitLine("}");
      //Generate toString method
      if (this.customDartOption.generateToString) {
        this.ensureBlankLine();
        this.emitLine("@override");
        this.emitLine("String toString(){");
        let data = "return '";
        this.indent(() => {
          this.forEachClassProperty(c, "none", (name, jsonName, property) => {
            data += "$" + this.sourcelikeToString(name) + ", ";
          });
          return data;
        });
        this.emitLine(data, "';");
        this.emitLine("}");
      }
      //
      this.ensureBlankLine();

      if (this.customDartOption.generateToJson) {
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
    });
  }

  protected emitEnumDefinition(e: EnumType, enumName: Name): void {
    const caseNames: Sourcelike[] = Array.from(e.cases).map((c) => this.nameForEnumCase(e, c));
    this.emitDescription(this.descriptionForType(e));
    this.emitLine("enum ", enumName, " { ", arrayIntercalate(", ", caseNames), " }");

    if (this._options.justTypes) return;

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
    if (!this._options.justTypes && !this._options.codersInClass) {
    }

    this.forEachNamedType(
      "leading-and-interposing",
      (c: ClassType, n: Name) =>
        this._options.useFreezed
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
