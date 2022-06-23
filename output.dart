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
    final int valInt;

    @JsonKey(name: 'val_bool') 
    final bool valBool;

    @JsonKey(name: 'val_date') 
    final DateTime? valDate;

    @JsonKey(name: 'val_string') 
    final String valString;

    @JsonKey(name: 'val_null') 
    final dynamic valNull;

    @JsonKey(name: 'val_double') 
    final double valDouble;

    @JsonKey(name: 'val_arr_int') 
    final List<int> valArrInt;

    @JsonKey(name: 'value_arr_empty') 
    final List<dynamic> valueArrEmpty;

    @JsonKey(name: 'value_obj_empty') 
    final ValueObjEmpty? valueObjEmpty;

    @JsonKey(name: 'val_arr_string') 
    final List<String> valArrString;

    @JsonKey(name: 'val_obj') 
    final ValObj? valObj;

    @JsonKey(name: 'val_obj_in_obj') 
    final ValObjInObj? valObjInObj;

    @JsonKey(name: 'val_arr_obj') 
    final List<ValArrObj> valArrObj;

    factory MyClass.fromJson(Map<String, dynamic> json){ 
        return MyClass(
        valInt: json["val_int"] ?? 0,
        valBool: json["val_bool"] ?? false,
        valDate: json["val_date"] == null ? null : DateTime.parse(json["val_date"]),
        valString: json["val_string"] ?? "",
        valNull: json["val_null"],
        valDouble: json["val_double"] ?? 0.toDouble(),
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

    Map<String, dynamic> toJson() => {
        "val_int": valInt,
        "val_bool": valBool,
        "val_date": valDate?.toIso8601String(),
        "val_string": valString,
        "val_null": valNull,
        "val_double": valDouble,
        "val_arr_int": List<int>.from(valArrInt.map((x) => x)),
        "value_arr_empty": List<dynamic>.from(valueArrEmpty.map((x) => x)),
        "value_obj_empty": valueObjEmpty?.toJson(),
        "val_arr_string": List<String>.from(valArrString.map((x) => x)),
        "val_obj": valObj?.toJson(),
        "val_obj_in_obj": valObjInObj?.toJson(),
        "val_arr_obj": List<ValArrObj>.from(valArrObj.map((x) => x?.toJson())),
    };
}

class ValArrObj {
    ValArrObj({
        required this.dog,
        required this.cat,
        required this.hehe,
        required this.test,
    });

    @JsonKey(name: 'dog') 
    final String dog;

    @JsonKey(name: 'cat') 
    final double cat;

    @JsonKey(name: 'hehe') 
    final bool hehe;

    @JsonKey(name: 'test') 
    final String test;

    factory ValArrObj.fromJson(Map<String, dynamic> json){ 
        return ValArrObj(
        dog: json["dog"] ?? "",
        cat: json["cat"] ?? 0.toDouble(),
        hehe: json["hehe"] ?? false,
        test: json["test"] ?? "",
    );
    }

    @override
    String toString(){
    return '$dog, $cat, $hehe, $test';
    }

    Map<String, dynamic> toJson() => {
        "dog": dog,
        "cat": cat,
        "hehe": hehe,
        "test": test,
    };
}

class ValObj {
    ValObj({
        required this.street,
        required this.city,
    });

    @JsonKey(name: 'street') 
    final String street;

    @JsonKey(name: 'city') 
    final String city;

    factory ValObj.fromJson(Map<String, dynamic> json){ 
        return ValObj(
        street: json["street"] ?? "",
        city: json["city"] ?? "",
    );
    }

    @override
    String toString(){
    return '$street, $city';
    }

    Map<String, dynamic> toJson() => {
        "street": street,
        "city": city,
    };
}

class ValObjInObj {
    ValObjInObj({
        required this.street,
        required this.city,
        required this.province,
    });

    @JsonKey(name: 'street') 
    final String street;

    @JsonKey(name: 'city') 
    final String city;

    @JsonKey(name: 'province') 
    final Province? province;

    factory ValObjInObj.fromJson(Map<String, dynamic> json){ 
        return ValObjInObj(
        street: json["street"] ?? "",
        city: json["city"] ?? "",
        province: json["province"] == null ? null : Province.fromJson(json["province"]),
    );
    }

    @override
    String toString(){
    return '$street, $city, $province';
    }

    Map<String, dynamic> toJson() => {
        "street": street,
        "city": city,
        "province": province?.toJson(),
    };
}

class Province {
    Province({
        required this.country,
        required this.population,
        required this.something,
    });

    @JsonKey(name: 'country') 
    final String country;

    @JsonKey(name: 'population') 
    final double population;

    @JsonKey(name: 'something') 
    final List<String> something;

    factory Province.fromJson(Map<String, dynamic> json){ 
        return Province(
        country: json["country"] ?? "",
        population: json["population"] ?? 0.toDouble(),
        something: json["something"] == null ? [] : List<String>.from(json["something"]!.map((x) => x)),
    );
    }

    @override
    String toString(){
    return '$country, $population, $something';
    }

    Map<String, dynamic> toJson() => {
        "country": country,
        "population": population,
        "something": List<String>.from(something.map((x) => x)),
    };
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

    Map<String, dynamic> toJson() => {
    };
}
