# 🧠 Gestión Back

Backend del sistema **Proyec-Tec**, desarrollado en **Node.js** con **Express** y base de datos **SQL** (usando Sequelize ORM). Este servicio maneja la lógica principal del sistema: usuarios, eventos, tickets, notificaciones, pedidos, reseñas y más.

---

## 🚀 Tecnologías Utilizadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [Socket.IO](https://socket.io/) – Notificaciones en tiempo real
- [JWT](https://jwt.io/) – Autenticación

---

## 📁 Estructura del Proyecto

```
gestion-back/
├── controllers/       # Lógica de negocio de cada entidad
├── models/            # Definiciones Sequelize de cada tabla
├── routes/            # Endpoints de API
├── middleware/        # Middlewares personalizados (auth, errores)
├── config/            # Configuración de Sequelize y conexión DB
├── socket/            # Comunicación en tiempo real
└── index.js           # Entrada principal del servidor
```

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Cristhofer-0/gestion-back.git
cd gestion-back

# Instalar dependencias
npm install
```

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz y configura tus variables:

```env
PORT=3000
DB_HOST=localhost
DB_NAME=proyectec
DB_USER=root
DB_PASSWORD=tu_clave
JWT_SECRET=secreto_super_seguro
```

Configura también `config/config.js` para tu entorno y base de datos.

---

## 🧪 Uso en Desarrollo

```bash
# Iniciar el servidor
npm run dev
```

---

## 🔌 Endpoints Principales

- `/api/usuarios`
- `/api/eventos`
- `/api/tickets`
- `/api/notificaciones`
- `/api/orders`

La mayoría de endpoints están autenticados con JWT.

---

## 🔔 WebSocket

Este backend emite eventos a través de `Socket.IO` para:
- Notificaciones en tiempo real cuando un evento se modifica, desactiva o crea.
- Actualizaciones a clientes suscritos al canal del usuario.

---

## ✅ Estado

> 🛠️ Proyecto activo, conectado a los frontends: [`gestion-front`](https://github.com/Cristhofer-0/gestion-front) y [`proyec-tec-front`](https://github.com/Cristhofer-0/proyec-tec-front)

---

## 📄 Licencia

MIT

---

## ✨ Autores

Desarrollado por:  
- [Cristhofer](https://github.com/Cristhofer-0)  
- [Miguel](https://github.com/sevenjpg8)  
- [Franco](https://github.com/LuisFr3)  
- [Adrian](https://github.com/SkipCodeBytes)  
- [Sebastian](https://github.com/sebaslade)
