#!/usr/bin/env sh
# sh deploy.sh  - run (в bash)

# остановить публикацию при ошибках
set -e

# сводка приложения
npm run build

# создание папки build и копирование содержимого папки dist в нее
mkdir build
cp -r dist/* build/

# инициализация репозитория и загрузка кода в GitHub
git init

# добавление всех файлов, кроме папки node_modules
git add -A
git reset -- node_modules

git commit -m"deploy"

git push -f https://github.com/pkhtn-vld/moire-vue3-capi.git master:gh-pages

# удаление папки build
rm -rf build