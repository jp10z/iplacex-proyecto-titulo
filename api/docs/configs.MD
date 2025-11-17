# RENDER

Settings

|Opcion|Valor|
|-|-|
|Root Directory|web|
|Build command|npm run build|
|Publish Directory|dist|

Redirect and Rewrite Rules

|Source|Destination|Action|
|-|-|-|
|/*|/index.html|Rewrite|

# Fly.io

Deploy

```shell
fly deploy
```