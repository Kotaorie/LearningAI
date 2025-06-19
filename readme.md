# 🧠 LearningAI - Plateforme de formation intelligente

LearningAI est une plateforme web d'apprentissage assisté par IA. Elle génère des cours personnalisés (vidéos et textes), en fonction du profil de l'utilisateur : niveau, objectifs, disponibilités hebdomadaires. L'infrastructure repose sur une architecture microservices, RabbitMQ pour la file de traitement, et GraphQL comme point d'entrée.

---

## 🚀 Stack technique

- **Backend** : NestJS (GraphQL Gateway + microservices)
- **Communication inter-services** : RabbitMQ
- **Base de données** : PostgreSQL
- **Tests** : Jest 
- **CI/CD** : GitHub Actions / GitLab CI 
- **Déploiement** : Docker + AWS

---

## 🛠️ Installation & développement

1. **Cloner le repo**

```bash
git clone https://github.com/Kotaorie/LearningAI.git
cd LearningAI
```

3. **Modifier les env.test**
```bash
API_GATEWAY_PORT=3001
DB_HOST=localhost
DB_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=learning-ai-db
JWT_SECRET=jpp_secret
```

2. **Lancer les services avec Docker**
```bash
docker-compose -f compose.dev.yaml up --build
```

Accès :
 - GraphQL Playground : http://localhost:3001/graphql
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

 - /back/nest-back/apps/api-gateway   → point d'entrée GraphQL
 - /back/nest-back/apps/user          → gestion des utilisateurs et auth
 - /back/nest-back/apps/schedule      → création du planning hebdo
 - /back/nest-back/apps/course        → demande de cours à l'IA via MQ

### 👥 Équipe

    Nicolas Servary — dev

    Tancrede Castet — dev

### 📄 Licence

Projet réalisé dans le cadre du module [Projet Web – EFREI M1 DEV].

---

## Contributeur

Nicolas SERVARY : nicolas.servary@efrei.net
Tancrède CASTETS : tancrede.castets@efrei.net
