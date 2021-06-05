class GoGymClass {
    GoGymClass({
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
    });

    final DateTime? updatedAt;
    final DateTime? createdAt;
    final dynamic deletedAt;
    final int? id;
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

    factory GoGymClass.fromJson(Map<String, dynamic> json) => GoGymClass(
        updatedAt: json["updated_at"] == null ? null : DateTime.parse(json["updated_at"]),
        createdAt: json["created_at"] == null ? null : DateTime.parse(json["created_at"]),
        deletedAt: json["deleted_at"],
        id: json["id"] == null ? null : json["id"],
        image: json["image"] == null ? null : json["image"],
        name: json["name"] == null ? null : json["name"],
        timeIn: json["time_in"] == null ? null : json["time_in"],
        timeOut: json["time_out"] == null ? null : json["time_out"],
        dayOfWeek: json["day_of_week"] == null ? null : json["day_of_week"],
        limit: json["limit"] == null ? null : json["limit"],
        description: json["description"] == null ? null : json["description"],
        khDescription: json["kh_description"] == null ? null : json["kh_description"],
        active: json["active"] == null ? null : json["active"],
        instructorId: json["instructor_id"] == null ? null : json["instructor_id"],
        serviceId: json["service_id"] == null ? null : json["service_id"],
        service: json["service"],
        count: json["count"] == null ? null : json["count"],
        status: json["status"] == null ? null : json["status"],
        join: json["join"] == null ? null : List<dynamic>.from(json["join"].map((x) => x)),
    );

}
