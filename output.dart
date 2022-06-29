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

    final int? valInt;
    final bool? valBool;
    final DateTime? valDate;
    final String? valString;
    final dynamic valNull;
    final double? valDouble;
    final List<int> valArrInt;
    final List<dynamic> valueArrEmpty;
    final ValueObjEmpty? valueObjEmpty;
    final List<String> valArrString;
    final ValObj? valObj;
    final ValObjInObj? valObjInObj;
    final List<ValArrObj> valArrObj;

    factory MyClass.fromJson(Map<String, dynamic> json){ 
        return MyClass(
        valInt: json["val_int"],
        valBool: json["val_bool"],
        valDate: json["val_date"] == null ? null : DateTime.parse(json["val_date"]),
        valString: json["val_string"],
        valNull: json["val_null"],
        valDouble: json["val_double"],
        valArrInt: json["val_arr_int"] == null ? [] : List<int>.from(json["val_arr_int"]!.map((x) => x)),
        valueArrEmpty: json["value_arr_empty"] == null ? [] : List<dynamic>.from(json["value_arr_empty"]!.map((x) => x)),
        valueObjEmpty: json["value_obj_empty"] == null ? null : ValueObjEmpty.fromJson(json["value_obj_empty"]),
        valArrString: json["val_arr_string"] == null ? [] : List<String>.from(json["val_arr_string"]!.map((x) => x)),
        valObj: json["val_obj"] == null ? null : ValObj.fromJson(json["val_obj"]),
        valObjInObj: json["val_obj_in_obj"] == null ? null : ValObjInObj.fromJson(json["val_obj_in_obj"]),
        valArrObj: json["val_arr_obj"] == null ? [] : List<ValArrObj>.from(json["val_arr_obj"]!.map((x) => ValArrObj.fromJson(x))),
    );
    }

    @override
    String toString(){
    return '$valInt, $valBool, $valDate, $valString, $valNull, $valDouble, $valArrInt, $valueArrEmpty, $valueObjEmpty, $valArrString, $valObj, $valObjInObj, $valArrObj';
    }

}

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

    factory ValArrObj.fromJson(Map<String, dynamic> json){ 
        return ValArrObj(
        dog: json["dog"],
        cat: json["cat"],
        hehe: json["hehe"],
        test: json["test"],
    );
    }

    @override
    String toString(){
    return '$dog, $cat, $hehe, $test';
    }

}

class ValObj {
    ValObj({
        required this.street,
        required this.city,
    });

    final String? street;
    final String? city;

    factory ValObj.fromJson(Map<String, dynamic> json){ 
        return ValObj(
        street: json["street"],
        city: json["city"],
    );
    }

    @override
    String toString(){
    return '$street, $city';
    }

}

class ValObjInObj {
    ValObjInObj({
        required this.street,
        required this.city,
        required this.province,
    });

    final String? street;
    final String? city;
    final Province? province;

    factory ValObjInObj.fromJson(Map<String, dynamic> json){ 
        return ValObjInObj(
        street: json["street"],
        city: json["city"],
        province: json["province"] == null ? null : Province.fromJson(json["province"]),
    );
    }

    @override
    String toString(){
    return '$street, $city, $province';
    }

}

class Province {
    Province({
        required this.country,
        required this.population,
        required this.something,
    });

    final String? country;
    final double? population;
    final List<String> something;

    factory Province.fromJson(Map<String, dynamic> json){ 
        return Province(
        country: json["country"],
        population: json["population"],
        something: json["something"] == null ? [] : List<String>.from(json["something"]!.map((x) => x)),
    );
    }

    @override
    String toString(){
    return '$country, $population, $something';
    }

}

class ValueObjEmpty {
    ValueObjEmpty();

    factory ValueObjEmpty.fromJson(Map<String, dynamic> json){ 
        return ValueObjEmpty(
    );
    }

    @override
    String toString(){
    return '';
    }

}
