# Projet LP Dev Mob FullStack 2023

## KIOSQUE IUT: Gestionnaire de matériels informatiques pour l'IUT de la Rochelle

Ce projet est une application web en React de gestion de stock de matériel informatique développé dans le cadre de la Licence professionnelle Développement Mobile parcours Full Stack de l'IUT de La Rochelle. Il a été réalisé par KAWKA Robin, HURDEBOURCQ Romain, HELIAS Arthur et PIHAN Alexis.


## Dépots
L'application est composée de deux dépots :

- Le dépot front contenant l'application React JS
- Le dépot back contenant les composants API Platform

## Installation du projet : 

Pour lancer l'application, il faut :
1. Cloner le repo GitHub sur votre machine locale.
2. Installer les dépendances (dossier `node_modules`) avec la commande `npm install` dans le meme dossier que `package.json` 
3. Lancer l'application en exécutant la commande `npm start`

Doc : http://dwcs-instructions.k8s.iut-larochelle.fr/docs/category/frontend---reactjs

## Utilisation

L'application permet aux utilisateurs (le secrétariat notamment.) de consulter la liste des matériels disponibles, empruntés et en attente. Ils peuvent également gérer l'emprunt d'un matériel et son retour.

## Fonctionnalités : 

- Consultation de la liste des matériels disponibles, empruntés et en attente
- Emprunt de matériel disponible à un utilisateur
- Gestion du retour de l'emprunt

## Technologies utilisées : 

- React pour la construction de l'interface utilisateur
- Fetch pour effectuer les appels HTTP à l'API back-end
- MUI React pour certains composants de l'interface utilisateur
