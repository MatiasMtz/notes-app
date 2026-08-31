#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

# Directorios
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

# Configuración de la base de datos
DB_NAME="ensolvers_notes_app"
DB_USER="ensolvers_user"
DB_PASS="ensolvers_password"

echo -e "${GREEN}Iniciando la configuración del proyecto...${NC}"

# Verificar si MySQL está instalado
if ! command -v mysql &> /dev/null; then
  echo -e "${RED}MySQL no está instalado. Por favor, instálalo antes de continuar.${NC}"
  exit 1
fi

# Crear la base de datos y el usuario usando sudo
echo -e "${GREEN}Configurando la base de datos...${NC}"
sudo mysql -u root -e "
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;"
if [ $? -ne 0 ]; then
  echo -e "${RED}Error al configurar la base de datos.${NC}"
  exit 1
fi
echo -e "${GREEN}Base de datos y usuario configurados correctamente.${NC}"

# Configurar el backend
echo -e "${GREEN}Configurando el backend...${NC}"
cd $BACKEND_DIR || exit
npm install

# Ejecutar migraciones con Sequelize CLI
echo -e "${GREEN}Ejecutando migraciones...${NC}"
npx sequelize-cli db:migrate
if [ $? -ne 0 ]; then
  echo -e "${RED}Error al ejecutar las migraciones.${NC}"
  exit 1
fi
cd ..

# Configurar el frontend
echo -e "${GREEN}Configurando el frontend...${NC}"
cd $FRONTEND_DIR || exit
npm install

# Compilar el frontend con Webpack
npx webpack --mode development
if [ $? -ne 0 ]; then
  echo -e "${RED}Error al compilar el frontend.${NC}"
  exit 1
fi
cd ..

# Iniciar las aplicaciones
echo -e "${GREEN}Iniciando el backend...${NC}"
cd $BACKEND_DIR || exit
npm start &
BACKEND_PID=$!

echo -e "${GREEN}Iniciando el frontend...${NC}"
cd ../$FRONTEND_DIR || exit
npm start &
FRONTEND_PID=$!

echo -e "${GREEN}La aplicación está en ejecución.${NC}"
echo -e "${GREEN}Backend (PID: $BACKEND_PID) en http://localhost:5000.${NC}"
echo -e "${GREEN}Frontend (PID: $FRONTEND_PID) en http://localhost:3000.${NC}"

# Esperar a que los procesos terminen
wait $BACKEND_PID $FRONTEND_PID
