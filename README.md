# Dart QuickType

version: 2.1.3

A custom implemenation of JSON to Dart model class from [QuickType](https://github.com/quicktype/quicktype).

[![Netlify Status](https://api.netlify.com/api/v1/badges/f0148cf0-a1b5-4db5-89e9-936157b57e19/deploy-status)](https://app.netlify.com/sites/dart-quicktype/deploys)

This project is configure to fit my use case only so the default behavior will be:

- All fields are **final**
- All fields are **required** 
- has an option to generate toJSON,copyWith and toString
- **Nullable Array** fields will result in _empty array_ instead of null object
- No freezed or hive

## Type setting

When Dart model type generate from json, some type are nullable and some type are non-null and replace by default value in case of null

| Type      | Nullable | default value  |
| ----------- | ----------- |---------- |
| String      | false       | ""           |
| bool   | false        |        false   |
| int   | false        |        0   |
| double   | false        |      0     |
| Array   | false        |      []     |
| Object   | true        |    null       |
| DateTime   | true        |   null        |


## URL

- Production: https://dart-quicktype.netlify.app/


### Customize for your use case
- edit Dart's quicktype config in **custom_dart_renderer.ts**
- run **npm run build** to build from ts to vanilla js
- test your change in index.html
