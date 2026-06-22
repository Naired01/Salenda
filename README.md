# Salenda

Sistema completo para la gestión y reserva de salas de conferencias con panel de administración y modo quiosco.

## Características

- Autenticación JWT (login/registro)
- Gestión de salas (CRUD, solo admin)
- Reservas con validación de conflictos
- Vista de calendario
- Modo quiosco público (sin autenticación)
- Panel de administración

## Tecnologías

### Backend
- Django 5 + Django REST Framework
- PostgreSQL
- SimpleJWT

### Frontend
- React 18 + TypeScript
- Vite + Tailwind CSS
- React Router + Zustand
- React Big Calendar

## Instalación

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
```

Configurar base de datos PostgreSQL y crear archivo `backend/.env` con las credenciales.

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend disponible en `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`.

## Uso

- Accede a `http://localhost:5173`, regístrate o inicia sesión.
- Crea salas desde el panel de administración (`/admin/rooms`).
- Los usuarios crean reservas desde `/reservations/new`.
- El modo quiosco (`/kiosk`) muestra el estado de las salas sin requerir autenticación.

## Estructura

```
OfficeRs/
├── backend/
│   ├── apps/
│   │   ├── users/          # Autenticación
│   │   ├── rooms/          # Gestión de salas
│   │   ├── reservations/   # Reservas
│   │   └── api/            # API pública (quiosco)
│   ├── config/             # Configuración Django
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── services/       # Servicios API
│   │   ├── store/          # Estado global
│   │   └── types/          # Tipos TypeScript
│   └── package.json
└── README.md
```
