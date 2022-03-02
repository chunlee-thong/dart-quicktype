class MyClass {
    MyClass({
        required this.updatedAt,
        required this.createdAt,
        required this.deletedAt,
        required this.id,
        required this.image,
        required this.name,
        required this.timeIn,
        required this.timeOut,
        required this.dayOfWeek,
        required this.limit,
        required this.description,
        required this.khDescription,
        required this.active,
        required this.instructorId,
        required this.serviceId,
        required this.service,
        required this.count,
        required this.status,
        required this.join,
        required this.date,
        required this.age,
        required this.money,
        required this.sick,
        required this.images,
        required this.address,
    });

    final DateTime? updatedAt;
    final DateTime? createdAt;
    final dynamic deletedAt;
    final int id;
    final String? image;
    final String? name;
    final String? timeIn;
    final String? timeOut;
    final String? dayOfWeek;
    final int? limit;
    final String? description;
    final String? khDescription;
    final bool? active;
    final int? instructorId;
    final int? serviceId;
    final dynamic service;
    final int? count;
    final String? status;
    final List<dynamic>? join;
    final DateTime? date;
    final int? age;
    final double? money;
    final bool? sick;
    final List<String>? images;
    final Address? address;

    factory MyClass.fromJson(Map<String, dynamic>? json){ 
        return MyClass(
        updatedAt: json?["updated_at"] == null ? null : DateTime.parse(json?["updated_at"]),
        createdAt: json?["created_at"] == null ? null : DateTime.parse(json?["created_at"]),
        deletedAt: json?["deleted_at"],
        id: json?["id"],
        image: json?["image"],
        name: json?["name"],
        timeIn: json?["time_in"],
        timeOut: json?["time_out"],
        dayOfWeek: json?["day_of_week"],
        limit: json?["limit"],
        description: json?["description"],
        khDescription: json?["kh_description"],
        active: json?["active"],
        instructorId: json?["instructor_id"],
        serviceId: json?["service_id"],
        service: json?["service"],
        count: json?["count"],
        status: json?["status"],
        join: json?["join"] == null ? [] : List<dynamic>.from(json?["join"]!.map((x) => x)),
        date: json?["date"] == null ? null : DateTime.parse(json?["date"]),
        age: json?["age"],
        money: json?["money"],
        sick: json?["sick"],
        images: json?["images"] == null ? [] : List<String>.from(json?["images"]!.map((x) => x)),
        address: Address.fromJson(json?["address"]),
    );
    }

    @override
    String toString(){
    return '$updatedAt, $createdAt, $deletedAt, $id, $image, $name, $timeIn, $timeOut, $dayOfWeek, $limit, $description, $khDescription, $active, $instructorId, $serviceId, $service, $count, $status, $join, $date, $age, $money, $sick, $images, $address';
    }

}

class Address {
    Address({
        required this.street,
        required this.city,
    });

    final String? street;
    final String? city;

    factory Address.fromJson(Map<String, dynamic>? json){ 
        return Address(
        street: json?["street"],
        city: json?["city"],
    );
    }

    @override
    String toString(){
    return '$street, $city';
    }

}
