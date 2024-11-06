# Emotorad Backend Task: Identity Reconciliation

## Project Overview
This project is a backend service that solves the unique identity reconciliation problem for *Emotorad* in collaboration with *Zamazon.com*. The goal is to link multiple orders made by the same user (using different email addresses or phone numbers) to a single identity, allowing for a personalized and consistent experience across orders.

## Problem Statement
Dr. Chandrashekar (referred to as "Doc") is a customer who uses different emails and phone numbers for each purchase to maintain privacy. The task requires creating a service that identifies and links such entries to consolidate contact information for a single identity.

## Solution Outline
The solution includes a single API endpoint, /identify, which:
1. Accepts JSON payloads containing email and phoneNumber.
2. Returns a JSON response with:
   - primaryContactId: The main identifier for the consolidated contact.
   - emails: A list of all associated emails.
   - phoneNumbers: A list of all associated phone numbers.
   - secondaryContactIds: A list of IDs for any secondary (linked) contacts.
3. Manages new contact creation and the linking of secondary contacts, based on overlap in email or phoneNumber.

## Technologies Used
- *Node.js* with *Express*: For building the API.
- *SQLite* with *Sequelize*: As the database and ORM to handle the contacts and relationships.

## Requirements
- */identify Endpoint*: This endpoint processes contact information to:
  - *Create a New Primary Contact* when no match is found.
  - *Create Secondary Contacts* when partial matches exist (either email or phoneNumber).
  - *Update Contact Roles* dynamically to ensure consistency in primary and secondary designations.

## Project Setup

### Prerequisites
- *Node.js* and *npm* installed on your system.
- *SQLite* installed, as it's the database used for this project.

### Installation Instructions
1. *Clone the Repository*
   ```bash
   git clone https://github.com/Rayala07/Emotorad
   cd emotorad-backend-task
