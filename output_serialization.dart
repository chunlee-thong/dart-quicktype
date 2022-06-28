import 'package:json_annotation/json_annotation.dart';

part 'filename.g.dart';

@JsonSerializable(createToJson: false)
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
    final int? valInt;

    @JsonKey(name: 'val_bool') 
    final bool? valBool;

    @JsonKey(name: 'val_date') 
    final DateTime? valDate;

    @JsonKey(name: 'val_string') 
    final String? valString;

    @JsonKey(name: 'val_null') 
    final dynamic valNull;

    @JsonKey(name: 'val_double') 
    final double? valDouble;

    @JsonKey(name: 'val_arr_int') 
    final List<int>? valArrInt;

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

    @override
    String toString(){
    return '$valInt, $valBool, $valDate, $valString, $valNull, $valDouble, $valArrInt, $valueArrEmpty, $valueObjEmpty, $valArrString, $valObj, $valObjInObj, $valArrObj';
    }

}

@JsonSerializable(createToJson: false)
class ValArrObj {
    ValArrObj({
        required this.dog,
        required this.cat,
        required this.hehe,
        required this.test,
    });

    final String? dog;
    final double? cat;
    final bool? hehe;
    final String? test;

    factory ValArrObj.fromJson(Map<String, dynamic> json) => _$ValArrObjFromJson(json);

    @override
    String toString(){
    return '$dog, $cat, $hehe, $test';
    }

}

@JsonSerializable(createToJson: false)
class ValObj {
    ValObj({
        required this.street,
        required this.city,
    });

    final String? street;
    final String? city;

    factory ValObj.fromJson(Map<String, dynamic> json) => _$ValObjFromJson(json);

    @override
    String toString(){
    return '$street, $city';
    }

}

@JsonSerializable(createToJson: false)
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

    @override
    String toString(){
    return '$street, $city, $province';
    }

}

@JsonSerializable(createToJson: false)
class Province {
    Province({
        required this.country,
        required this.population,
        required this.something,
    });

    final String? country;
    final double? population;
    final List<String>? something;

    factory Province.fromJson(Map<String, dynamic> json) => _$ProvinceFromJson(json);

    @override
    String toString(){
    return '$country, $population, $something';
    }

}

@JsonSerializable(createToJson: false)
class ValueObjEmpty {
    ValueObjEmpty();

    factory ValueObjEmpty.fromJson(Map<String, dynamic> json) => _$ValueObjEmptyFromJson(json);

    @override
    String toString(){
    return '';
    }

}
