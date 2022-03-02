# Dart QuickType

A custom implemenation of JSON to Dart model class from [QuickType](https://github.com/quicktype/quicktype).

This project is configure to fit my use case only so the default behavior will be:

- All fields are **final**
- All fields are **nullable** and **required**
- has an option to generate toJSON,copyWith and toString
- No freezed or hive

## URL

- Production: https://dart-quicktype.netlify.app/
- Preview: https://deploy-preview-1--dart-quicktype.netlify.app/

## Folder

- src: custom Dart renderer modified from QuickType and written in Typescipt
- dist: compiled TS code into vanilla JS using webpack
- front-end: plain HTML site
