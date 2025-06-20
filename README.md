# Car Configurator

# Car Configurator

## Project Description

Car Configurator is a web application that allows users to create a personalized car order. Users can select various parts and accessories for the vehicle, as well as see the total cost of the configuration in real-time. After completing the configuration, they can place an order, which will be saved in the database. This is one of the 4/5 projects completed as part of the React course by Frontowcy.

## Architecture

The application consists of:

- **Frontend** created with React.js
- **JSON Server** as a simple backend for data storage
- **Redux Toolkit/Zustand** for managing global state
- **React Query** for data fetching and caching management
- **Local Storage** for storing the user's configuration
- **Material UI** for component styling

### Workflow:

1. The user selects parts in the configurator.
2. The application saves the configuration in global state and local storage.
3. After completing the configuration, the user enters their details.
4. The order is saved in the database.
5. The user can browse all submitted orders.

## Tech Stack

| Technology            | Usage                        |
| --------------------- | ---------------------------- |
| React.js              | User interface               |
| Redux Toolkit/Zustand | State management             |
| React Query           | Optimizing data fetching     |
| JSON Server           | Backend API                  |
| Material UI           | UI/UX components             |
| React Router DOM      | Application navigation       |
| Husky + Linter        | Code formatting and checking |
| Local Storage         | Storing configuration        |
| Local Development     |                              |

### Requirements:

- Node.js v20.\*

## Cloning the Repository

git clone https://github.com/repo-link
cd car-configurator

# Installing dependencies

npm install

# Running the application

npm run start

# Running JSON Server

In a separate terminal, run:

npm json-server --watch db.json --port 3001

# Scripts in the Application

| Script      | Description                       |
| ----------- | --------------------------------- |
| start       | Run the app locally               |
| build       | Create a build of the application |
| test        | Run tests                         |
| json-server | Start a local API server          |
| lint        | Check code using ESLint           |
| lint:fix    | Automatically fix linter errors   |
| format      | Format code using Prettier        |
| prepare     | Install Husky for commit hooks    |

## Live Demo Link

**Car Configurator - Live Demo**

## Access Requirements

No login or password required.

## What Has Been Done?

- Interactive car order configurator
- JSON Server as backend for data storage
- Global configuration state with Redux Toolkit/Zustand
- Configuration storage in Local Storage
- Dynamic order cost calculation
- List of placed orders
- Styling with Material UI

## Future Plans

- Add the option to export the configuration to a PDF file
- Integrate with a payment system
- Allow saving orders in the Firebase database
- Develop a user system

## Contact

- **Email**: tomek12olech@gmail.com
- **GitHub**: [takimi12](https://github.com/takimi12)
- **LinkedIn**: [LinkedIn Profile](#)

## Opis projektu

Car Configurator to aplikacja webowa umożliwiająca użytkownikom tworzenie spersonalizowanego zamówienia samochodu. Użytkownik może wybierać różne części i dodatki do pojazdu, a także zobaczyć całkowity koszt konfiguracji w czasie rzeczywistym. Po zakończeniu konfiguracji może złożyć zamówienie, które zostanie zapisane w bazie danych. Jest to 4/5 projektów realizowanych w ramach kursu React od Frontowców.

## Architektura

Aplikacja składa się z:

- **Frontend** stworzonego w React.js
- **JSON Server** jako prostego backendu do przechowywania danych
- **Redux Toolkit/Zustand** do zarządzania stanem globalnym
- **React Query** do zarządzania pobieraniem i cache'owaniem danych
- **Local Storage** do przechowywania konfiguracji użytkownika
- **Material UI** do stylizacji komponentów

### Schemat działania:

1. Użytkownik wybiera części w kreatorze.
2. Aplikacja zapisuje konfigurację w stanie globalnym i local storage.
3. Po zakończeniu konfiguracji użytkownik podaje swoje dane.
4. Zamówienie jest zapisywane w bazie danych.
5. Użytkownik może przeglądać wszystkie złożone zamówienia.

## Tech Stack

| Technologia           | Zastosowanie                    |
| --------------------- | ------------------------------- |
| React.js              | Interfejs użytkownika           |
| Redux Toolkit/Zustand | Zarządzanie stanem              |
| React Query           | Optymalizacja pobierania danych |
| JSON Server           | Backend API                     |
| Material UI           | UI/UX komponenty                |
| React Router DOM      | Nawigacja w aplikacji           |
| Husky + Linter        | Formatowanie i sprawdzanie kodu |
| Local Storage         | Przechowywanie konfiguracji     |
| Local Development     |                                 |

### Wymagania:

- Node.js v20.\*

## Klonowanie repozytorium

git clone https://github.com/repo-link
cd car-configurator

# Instalacja zależności

npm install

# Uruchomienie aplikacji

npm run start

# Uruchomienie JSON Server

w osobnym terminalu wpisz npm json-server --watch db.json --port 3001

# Skrypty w aplikacji

| Skrypt        | Opis                                   |
| ------------- | -------------------------------------- |
| `start`       | Uruchomienie aplikacji lokalnie        |
| `build`       | Tworzenie builda aplikacji             |
| `test`        | Uruchomienie testów                    |
| `json-server` | Uruchomienie lokalnego serwera API     |
| `lint`        | Sprawdzanie kodu ESLintem              |
| `lint:fix`    | Automatyczna poprawa błędów lintera    |
| `format`      | Formatowanie kodu za pomocą Prettier   |
| `prepare`     | Instalacja Husky dla kontroli commitów |

## Link do wersji live

[Car Configurator - Live Demo](#)

## Dostępy

Nie są wymagane loginy ani hasła.

## Co zostało zrobione?

- Interaktywny kreator zamówienia samochodu
- JSON Server jako backend do przechowywania danych
- Globalny stan konfiguracji w Redux Toolkit/Zustand
- Obsługa przechowywania konfiguracji w Local Storage
- Dynamiczne wyliczanie kosztu zamówienia
- Lista złożonych zamówień
- Stylizacja za pomocą Material UI

## Plany na przyszłość

- Dodanie opcji eksportu konfiguracji do pliku PDF
- Integracja z systemem płatności
- Dodanie możliwości zapisania zamówienia w bazie Firebase
- Rozbudowanie systemu użytkowników

# Kontakt

Email: tomek12olech@gmail.com
GitHub: [takimi12](https://github.com/takimi12)
LinkedIn:
