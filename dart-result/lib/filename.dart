import 'package:json_annotation/json_annotation.dart';

part 'filename.g.dart';

@JsonSerializable()
class MyClass {
    MyClass({
        required this.valInt,
        required this.valBool,
        required this.valDate,
        required this.valString,
        required this.valNull,
        required this.valDouble,
        required this.valArrInt,
        required this.valueArrEmpty,
        required this.valueObjEmpty,
        required this.valArrString,
        required this.valObj,
        required this.valObjInObj,
        required this.valArrObj,
    });

    @JsonKey(name: 'val_int') 
    final num? valInt;

    @JsonKey(name: 'val_bool') 
    final bool? valBool;

    @JsonKey(name: 'val_date') 
    final DateTime? valDate;

    @JsonKey(name: 'val_string') 
    final String? valString;

    @JsonKey(name: 'val_null') 
    final dynamic valNull;

    @JsonKey(name: 'val_double') 
    final num? valDouble;

    @JsonKey(name: 'val_arr_int') 
    final List<num>? valArrInt;

    @JsonKey(name: 'value_arr_empty') 
    final List<dynamic>? valueArrEmpty;

    @JsonKey(name: 'value_obj_empty') 
    final ValueObjEmpty? valueObjEmpty;

    @JsonKey(name: 'val_arr_string') 
    final List<String>? valArrString;

    @JsonKey(name: 'val_obj') 
    final ValObj? valObj;

    @JsonKey(name: 'val_obj_in_obj') 
    final ValObjInObj? valObjInObj;

    @JsonKey(name: 'val_arr_obj') 
    final List<ValArrObj>? valArrObj;

    factory MyClass.fromJson(Map<String, dynamic> json) => _$MyClassFromJson(json);

    Map<String, dynamic> toJson() => _$MyClassToJson(this);

    @override
    String toString(){
    return '$valInt, $valBool, $valDate, $valString, $valNull, $valDouble, $valArrInt, $valueArrEmpty, $valueObjEmpty, $valArrString, $valObj, $valObjInObj, $valArrObj';
    }
}

@JsonSerializable()
class ValArrObj {
    ValArrObj({
        required this.dog,
        required this.cat,
        required this.hehe,
        required this.test,
    });

    final String? dog;
    final num? cat;
    final bool? hehe;
    final String? test;

    factory ValArrObj.fromJson(Map<String, dynamic> json) => _$ValArrObjFromJson(json);

    Map<String, dynamic> toJson() => _$ValArrObjToJson(this);

    @override
    String toString(){
    return '$dog, $cat, $hehe, $test';
    }
}

@JsonSerializable()
class ValObj {
    ValObj({
        required this.street,
        required this.city,
    });

    final String? street;
    final String? city;

    factory ValObj.fromJson(Map<String, dynamic> json) => _$ValObjFromJson(json);

    Map<String, dynamic> toJson() => _$ValObjToJson(this);

    @override
    String toString(){
    return '$street, $city';
    }
}

@JsonSerializable()
class ValObjInObj {
    ValObjInObj({
        required this.street,
        required this.city,
        required this.province,
    });

    final String? street;
    final String? city;
    final Province? province;

    factory ValObjInObj.fromJson(Map<String, dynamic> json) => _$ValObjInObjFromJson(json);

    Map<String, dynamic> toJson() => _$ValObjInObjToJson(this);

    @override
    String toString(){
    return '$street, $city, $province';
    }
}

@JsonSerializable()
class Province {
    Province({
        required this.country,
        required this.population,
        required this.something,
    });

    final String? country;
    final num? population;
    final List<String>? something;

    factory Province.fromJson(Map<String, dynamic> json) => _$ProvinceFromJson(json);

    Map<String, dynamic> toJson() => _$ProvinceToJson(this);

    @override
    String toString(){
    return '$country, $population, $something';
    }
}

@JsonSerializable()
class ValueObjEmpty {
    ValueObjEmpty();

    factory ValueObjEmpty.fromJson(Map<String, dynamic> json) => _$ValueObjEmptyFromJson(json);

    Map<String, dynamic> toJson() => _$ValueObjEmptyToJson(this);

    @override
    String toString(){
    return '';
    }
}
