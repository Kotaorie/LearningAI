# 🧠 LearningAI - Plateforme de formation intelligente

LearningAI est une plateforme web d'apprentissage assisté par IA. Elle génère des cours personnalisés (vidéos et textes), ainsi que des quiz, en fonction du profil de l'utilisateur : niveau, objectifs, disponibilités hebdomadaires. L'infrastructure repose sur une architecture microservices, RabbitMQ pour la file de traitement, et GraphQL comme point d'entrée.

---

## 🚀 Stack technique

- **Frontend** : Next.js + URQL
- **Backend** : NestJS (GraphQL Gateway + microservices)
- **Communication inter-services** : RabbitMQ
- **Base de données** : PostgreSQL
- **Tests** : Jest + Supertest
- **CI/CD** : GitHub Actions / GitLab CI
- **Déploiement** : Docker + Railway/Render

---

## 🛠️ Installation & développement

1. **Cloner le repo**

```bash
git clone https://github.com/Kotaorie/LearningAI.git
cd LearningAI
```

2. **Lancer les services avec Docker**
```bash
docker-compose up --build
```

Accès :
 - GraphQL Playground : http://localhost:3000/graphql
 - RabbitMQ (admin UI) : http://localhost:15672

### ✅ Conventions de commit

Pour garder un historique clair, utilisez ce format pour vos commits :

 - [Feat] Ajouter le système de génération de cours
 - [Fix] Corriger le bug de validation du profil
 - [Refactor] Réorganiser les fichiers du scheduler
 - [Docs] Ajouter README pour course-service
 - [Test] Ajouter tests unitaires sur user-service
 - [Chore] MAJ des dépendances et config Docker

Chaque PR doit être validée par un membre de l'équipe + passer la CI avant d'être mergée.

### 📁 Structure (exemple)

 - /nuxt-app             → front end de l'application 

 - /back/gateway         → point d'entrée GraphQL
 - /back/user-service    → gestion des utilisateurs et auth
 - /back/profile-service → niveau, objectifs, disponibilités
 - /back/scheduler       → création du planning hebdo
 - /back/course-gen      → demande de cours à l'IA via MQ
 - /back/worker-ia       → traite la queue RabbitMQ (OpenAI)

### 👥 Équipe

    Nicolas Servary — dev

    Tancrede Castet — dev

### 📄 Licence

Projet réalisé dans le cadre du module [Projet Web – EFREI M1 DEV].

---

## Contributeur

Nicolas SERVARY : nicolas.servary@efrei.net
