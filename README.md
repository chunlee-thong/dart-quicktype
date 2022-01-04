# Dart QuickType

A custom implemenation of JSON to Dart model class from [QuickType](https://github.com/quicktype/quicktype).

This project is configure to fit my use case only so the default behavior will be:

- All properties **final**
- Every field is **nullable** and **required**
- Only has **fromJson** method, doesn't have **toJson**
- Always generate **copyWith** method

Also This below features are still only available in [preview](https://deploy-preview-1--dart-quicktype.netlify.app/) branch:

- rework Json check syntax
- add **toString** override


## URL

- Production: https://dart-quicktype.netlify.app/
- Preview: https://deploy-preview-1--dart-quicktype.netlify.app/

## Folder

- src: custom Dart renderer modified from QuickType and written in Typescipt
- dist: compiled TS code into vanilla JS using webpack
- front-end: plain HTML site
