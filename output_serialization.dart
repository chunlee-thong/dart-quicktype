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

    final int valInt;
    final bool valBool;
    final DateTime? valDate;
    final String valString;
    final dynamic valNull;
    final double valDouble;
    final List<int> valArrInt;
    final List<dynamic> valueArrEmpty;
    final ValueObjEmpty? valueObjEmpty;
    final List<String> valArrString;
    final ValObj? valObj;
    final ValObjInObj? valObjInObj;
    final List<ValArrObj> valArrObj;

    factory MyClass.fromJson(Map<String, dynamic> json) => _$MyClassFromJson(json);

    @override
    String toString(){
    return '$valInt, $valBool, $valDate, $valString, $valNull, $valDouble, $valArrInt, $valueArrEmpty, $valueObjEmpty, $valArrString, $valObj, $valObjInObj, $valArrObj';
    }

    Map<String, dynamic> toJson() => _$MyClassToJson(this);
}

@JsonSerializable()
class ValArrObj {
    ValArrObj({
        required this.dog,
        required this.cat,
        required this.hehe,
        required this.test,
    });

    final String dog;
    final double cat;
    final bool hehe;
    final String test;

    factory ValArrObj.fromJson(Map<String, dynamic> json) => _$ValArrObjFromJson(json);

    @override
    String toString(){
    return '$dog, $cat, $hehe, $test';
    }

    Map<String, dynamic> toJson() => _$ValArrObjToJson(this);
}

@JsonSerializable()
class ValObj {
    ValObj({
        required this.street,
        required this.city,
    });

    final String street;
    final String city;

    factory ValObj.fromJson(Map<String, dynamic> json) => _$ValObjFromJson(json);

    @override
    String toString(){
    return '$street, $city';
    }

    Map<String, dynamic> toJson() => _$ValObjToJson(this);
}

@JsonSerializable()
class ValObjInObj {
    ValObjInObj({
        required this.street,
        required this.city,
        required this.province,
    });

    final String street;
    final String city;
    final Province? province;

    factory ValObjInObj.fromJson(Map<String, dynamic> json) => _$ValObjInObjFromJson(json);

    @override
    String toString(){
    return '$street, $city, $province';
    }

    Map<String, dynamic> toJson() => _$ValObjInObjToJson(this);
}

@JsonSerializable()
class Province {
    Province({
        required this.country,
        required this.population,
        required this.something,
    });

    final String country;
    final double population;
    final List<String> something;

    factory Province.fromJson(Map<String, dynamic> json) => _$ProvinceFromJson(json);

    @override
    String toString(){
    return '$country, $population, $something';
    }

    Map<String, dynamic> toJson() => _$ProvinceToJson(this);
}

@JsonSerializable()
class ValueObjEmpty {
    ValueObjEmpty();

    factory ValueObjEmpty.fromJson(Map<String, dynamic> json) => _$ValueObjEmptyFromJson(json);

    @override
    String toString(){
    return '';
    }

    Map<String, dynamic> toJson() => _$ValueObjEmptyToJson(this);
}
