# Dart QuickType

### version: 2.1.6

A custom implemenation of JSON to Dart model class from [QuickType](https://github.com/quicktype/quicktype).

[![Netlify Status](https://api.netlify.com/api/v1/badges/f0148cf0-a1b5-4db5-89e9-936157b57e19/deploy-status)](https://app.netlify.com/sites/dart-quicktype/deploys)

## Site variation

- https://dart-quicktype.netlify.app/
- https://dart-quicktype-2.netlify.app/
- https://dart-quicktype-3.netlify.app/

This project is configure to fit my use case only so the default behavior will be:

- All fields are **final**
- All fields are **required** 
- Has an option to generate `toJSON`,`copyWith` and `toString`
- support `Equatable` and `JsonSerialize`
- No freezed or hive

## Type setting

When Dart class is generated from json, nullable or non-nullable field are define below.


| Type     | Nullable | default value |
| -------- | -------- | ------------- |
| String   | setting  | ""            |
| bool     | setting  | false         |
| int      | setting  | 0             |
| double   | setting  | 0             |
| Array    | never    | []            |
| Object   | always   | null          |
| DateTime | always   | null          |


- Array can never be null
- Object and DateTime always nullable
- Other types can configure with checkbox setting


### Customize for your use case
- edit Dart's quicktype config in **custom_dart_renderer.ts**
- run **npm run build** to build from ts to vanilla js
- test your change in index.html
