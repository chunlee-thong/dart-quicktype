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

    factory MyClass.fromJson(Map<String, dynamic> json){ 
        return MyClass(
        valInt: json["val_int"] ?? 0,
        valBool: json["val_bool"] ?? false,
        valDate: json["val_date"] == null ? null : DateTime.parse(json["val_date"]),
        valString: json["val_string"] ?? "",
        valNull: json["val_null"],
        valDouble: json["val_double"] ?? 0,
        valArrInt: json["val_arr_int"] == null ? [] : List<int>.from(json["val_arr_int"]!.map((x) => x)),
        valueArrEmpty: json["value_arr_empty"] == null ? [] : List<dynamic>.from(json["value_arr_empty"]!.map((x) => x)),
        valueObjEmpty: json["value_obj_empty"] == null ? null : ValueObjEmpty.fromJson(json["value_obj_empty"]),
        valArrString: json["val_arr_string"] == null ? [] : List<String>.from(json["val_arr_string"]!.map((x) => x)),
        valObj: json["val_obj"] == null ? null : ValObj.fromJson(json["val_obj"]),
        valObjInObj: json["val_obj_in_obj"] == null ? null : ValObjInObj.fromJson(json["val_obj_in_obj"]),
        valArrObj: json["val_arr_obj"] == null ? [] : List<ValArrObj>.from(json["val_arr_obj"]!.map((x) => ValArrObj.fromJson(x))),
    );
    }

}

class ValArrObj {
    ValArrObj({
        required this.dog,
        required this.cat,
        required this.hehe,
    });

    final String dog;
    final int cat;
    final bool hehe;

    factory ValArrObj.fromJson(Map<String, dynamic> json){ 
        return ValArrObj(
        dog: json["dog"] ?? "",
        cat: json["cat"] ?? 0,
        hehe: json["hehe"] ?? false,
    );
    }

}

class ValObj {
    ValObj({
        required this.street,
        required this.city,
    });

    final String street;
    final String city;

    factory ValObj.fromJson(Map<String, dynamic> json){ 
        return ValObj(
        street: json["street"] ?? "",
        city: json["city"] ?? "",
    );
    }

}

class ValObjInObj {
    ValObjInObj({
        required this.street,
        required this.city,
        required this.province,
    });

    final String street;
    final String city;
    final Province? province;

    factory ValObjInObj.fromJson(Map<String, dynamic> json){ 
        return ValObjInObj(
        street: json["street"] ?? "",
        city: json["city"] ?? "",
        province: json["province"] == null ? null : Province.fromJson(json["province"]),
    );
    }

}

class Province {
    Province({
        required this.country,
        required this.populatom,
    });

    final String country;
    final String populatom;

    factory Province.fromJson(Map<String, dynamic> json){ 
        return Province(
        country: json["country"] ?? "",
        populatom: json["populatom"] ?? "",
    );
    }

}

class ValueObjEmpty {
    ValueObjEmpty();

    factory ValueObjEmpty.fromJson(Map<String, dynamic> json){ 
        return ValueObjEmpty(
    );
    }

}
