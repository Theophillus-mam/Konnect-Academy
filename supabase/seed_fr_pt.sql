-- Konnecta Academy — French and Portuguese course content
-- Generated from the course definitions; safe to re-run.

-- ===== Français professionnel et quotidien =====
insert into courses (id, language_id, code, title, description, sort_order) values
  ('4031a033-95ff-5278-85a3-253e74434a3a', 'b9a9feec-0418-5362-a354-29f4898434b1', 'workplace-french', 'Français professionnel et quotidien', 'Le français pratique pour la communication professionnelle et la vie de tous les jours.', 1)
on conflict (id) do nothing;

insert into modules (id, course_id, slug, title, icon, blurb, sort_order) values
  ('94495b1d-8547-51ce-a6a2-2fb6d43c121d', '4031a033-95ff-5278-85a3-253e74434a3a', 'fr-m1', 'Le monde du travail', 'case', 'Communication professionnelle au bureau, sur le terrain et avec les clients.', 1),
  ('d32af733-0ccf-5e96-9339-1df6672040bf', '4031a033-95ff-5278-85a3-253e74434a3a', 'fr-m2', 'La vie quotidienne', 'users', 'Le français de tous les jours : services, voisins, démarches.', 2)
on conflict (id) do nothing;

insert into lessons (id, module_id, slug, title, tag, description, est_minutes, sort_order) values
  ('0d7119cf-9ef7-5ce0-b130-c06137fc7b57', '94495b1d-8547-51ce-a6a2-2fb6d43c121d', 'fr-l1', 'Structures et accords', 'Grammaire', 'Construire des phrases nuancées et accorder correctement.', 15, 1),
  ('07ab3175-07df-52d0-b925-cbeb9dc186cc', '94495b1d-8547-51ce-a6a2-2fb6d43c121d', 'fr-l2', 'Les courriels professionnels', 'Écrit', 'Rédiger des courriels clairs, polis et efficaces.', 15, 2),
  ('dee6d15d-ec9f-54bf-9376-d3f078074f55', '94495b1d-8547-51ce-a6a2-2fb6d43c121d', 'fr-l3', 'Participer à une réunion', 'Oral', 'Prendre la parole, nuancer et faire avancer une discussion.', 15, 3),
  ('e9221176-7e33-5b60-9aad-cd41286a3174', '94495b1d-8547-51ce-a6a2-2fb6d43c121d', 'fr-l4', 'Faire une présentation', 'Oral', 'Ouvrir, structurer et conclure une présentation courte.', 15, 4),
  ('f28c3f01-a7ea-5e4a-91c5-b7d65a9f332f', 'd32af733-0ccf-5e96-9339-1df6672040bf', 'fr-l5', 'Les interactions quotidiennes', 'Oral', 'Saluer, demander et réagir naturellement au quotidien.', 15, 1),
  ('d7da08f7-a33d-5d9f-89e1-a2255d9b37d2', 'd32af733-0ccf-5e96-9339-1df6672040bf', 'fr-l6', 'Prendre rendez-vous', 'Écoute', 'Fixer une heure, confirmer et gérer les changements.', 15, 2)
on conflict (id) do nothing;

insert into lesson_questions (id, lesson_id, sort_order, prompt, explanation, quote_from, quote_text, audio_url) values
  ('fe6c854b-da60-5c30-b02c-2b21c9835643', '0d7119cf-9ef7-5ce0-b130-c06137fc7b57', 1, 'Which sentence is correct?', 'With « depuis », French uses the present tense for something that started in the past and is still going on. English uses the present perfect here, which is why this catches learners out.', NULL, NULL, NULL),
  ('66302a65-0991-5110-9181-84bb7ecd2d0e', '0d7119cf-9ef7-5ce0-b130-c06137fc7b57', 2, 'Complete: « Bien que le projet ___ en retard, nous avons livré à temps. »', '« Bien que » always takes the subjunctive, so « soit » is required.', NULL, NULL, NULL),
  ('92fbdd9c-09de-5dc2-aa48-172c55dd68b6', '0d7119cf-9ef7-5ce0-b130-c06137fc7b57', 3, 'Complete: « Nous nous sommes ___ à neuf heures. »', 'Reflexive verbs form the perfect with « être », and the participle agrees with the subject — « nous » plural gives « réunis ».', NULL, NULL, NULL),
  ('1777461c-cbe5-5da1-b4ef-5649bc8959cf', '07ab3175-07df-52d0-b925-cbeb9dc186cc', 1, 'You interviewed at a logistics company in Lyon. Read the message and choose the most appropriate formal reply.', 'It acknowledges the message, stays formal with « vous », and repeats the timeline so both sides agree on what happens next.', 'Service des ressources humaines', 'Nous vous remercions de votre candidature. Nous reviendrons vers vous avant vendredi prochain.', 'simulated'),
  ('f07e8761-5948-5049-aa6b-a15518559ee2', '07ab3175-07df-52d0-b925-cbeb9dc186cc', 2, 'Which sign-off is standard in a neutral professional email?', '« Cordialement » is the everyday professional close. « Bisous » and « À toute » belong between friends.', NULL, NULL, NULL),
  ('267554b3-21db-50d4-966a-fc36640871f4', '07ab3175-07df-52d0-b925-cbeb9dc186cc', 3, 'Complete: « Veuillez trouver ci-___ le rapport. »', '« Ci-joint » is a fixed expression and stays invariable when it comes before the noun.', NULL, NULL, NULL),
  ('290467d5-cbb0-595e-9604-0bdd77c3b580', 'dee6d15d-ec9f-54bf-9376-d3f078074f55', 1, 'You want to disagree with your manager in a meeting. Which phrasing keeps the room comfortable?', 'Softening with « pas tout à fait » and asking permission turns a contradiction into a contribution.', NULL, NULL, NULL),
  ('0e3bee83-30cc-57ac-9b2f-5c2f7e273e69', 'dee6d15d-ec9f-54bf-9376-d3f078074f55', 2, 'Someone interrupts you mid-point. What do you say?', 'It holds your turn and hands it over deliberately — firm without being sharp.', NULL, NULL, NULL),
  ('907dc7ed-0f09-5414-a526-b764730caea3', 'dee6d15d-ec9f-54bf-9376-d3f078074f55', 3, 'Which phrase moves a stuck discussion forward?', 'Naming a concrete next step closes the item without dismissing anyone.', NULL, NULL, NULL),
  ('8739f293-0136-53bf-a24b-3b2ac3cf6934', 'e9221176-7e33-5b60-9aad-cd41286a3174', 1, 'Which opening orients the audience fastest?', 'It states duration, topic and payoff, so the audience knows immediately why to listen.', NULL, NULL, NULL),
  ('699cf3a4-a4fa-5693-80d7-637ad25203d3', 'e9221176-7e33-5b60-9aad-cd41286a3174', 2, 'You are moving to your second point. Which signpost is clearest?', 'Closing one idea before naming the next helps listeners follow the structure without the slides.', NULL, NULL, NULL),
  ('eaee4f95-7465-51c0-9373-d58115181f1c', 'e9221176-7e33-5b60-9aad-cd41286a3174', 3, 'Someone asks a question you cannot answer. Best response?', 'Admitting the gap and committing to a date protects your credibility; guessing at figures destroys it.', NULL, NULL, NULL),
  ('2c718185-e14c-54c5-8812-0c53fbeaa08c', 'f28c3f01-a7ea-5e4a-91c5-b7d65a9f332f', 1, 'A shop assistant asks « Je peux vous renseigner ? » What does she mean?', '« Renseigner » means to give information — it is the standard offer of help in a shop.', NULL, NULL, NULL),
  ('4afbb1c2-69dd-589b-9be5-94480a808caf', 'f28c3f01-a7ea-5e4a-91c5-b7d65a9f332f', 2, 'Choose the natural reply to « Ça va ? » from a neighbour.', 'Casual greetings take short, elliptical answers. Translating « I am fine » literally sounds wrong.', NULL, NULL, NULL),
  ('e23cd0ac-80b8-54a5-8a18-56a18c3eebf8', 'f28c3f01-a7ea-5e4a-91c5-b7d65a9f332f', 3, 'You did not catch what someone said. Which is most natural?', '« Pardon, vous pouvez… » is the standard polite repair phrase.', NULL, NULL, NULL),
  ('02ac9871-f4d4-5f9d-8c6b-59b0fd3de7b6', 'd7da08f7-a33d-5d9f-89e1-a2255d9b37d2', 1, 'You hear: « On dit dix heures et demie ? » What time is proposed?', '« Dix heures et demie » is half past ten. French says the hour first, then « et demie ».', NULL, NULL, 'simulated'),
  ('32190c5a-8f3a-59f0-bfd6-0c0342773315', 'd7da08f7-a33d-5d9f-89e1-a2255d9b37d2', 2, 'You need to move a meeting. Which is clearest on the phone?', 'It names the change and offers a specific alternative, so the other person can agree in one word.', NULL, NULL, NULL),
  ('b4b10cfc-efa5-581c-b21c-f6343960bbde', 'd7da08f7-a33d-5d9f-89e1-a2255d9b37d2', 3, 'Confirming a plan, which is most reliable?', 'Repeating date, time and place prevents the most common cause of missed meetings.', NULL, NULL, NULL)
on conflict (id) do nothing;

insert into lesson_options (id, question_id, sort_order, body, is_correct) values
  ('b59c5449-a836-5bb8-90bd-42766f473f2d', 'fe6c854b-da60-5c30-b02c-2b21c9835643', 1, 'Elle a travaillé ici depuis 2019.', false),
  ('80d72478-f824-5c56-b4b0-4eed545fb432', 'fe6c854b-da60-5c30-b02c-2b21c9835643', 2, 'Elle travaille ici depuis 2019.', true),
  ('67a18a0f-f353-579a-a38d-1e46c47f4c0a', 'fe6c854b-da60-5c30-b02c-2b21c9835643', 3, 'Elle travaillait ici depuis 2019.', false),
  ('540084d4-912b-5a4c-a649-2bb0b27643a0', '66302a65-0991-5110-9181-84bb7ecd2d0e', 1, 'soit', true),
  ('30bb6348-ef83-580b-833f-48e9c4a8009d', '66302a65-0991-5110-9181-84bb7ecd2d0e', 2, 'est', false),
  ('14fdaf21-a9f7-5af8-b1d1-df5625f9c615', '66302a65-0991-5110-9181-84bb7ecd2d0e', 3, 'était', false),
  ('3ebe8427-436a-5895-bf67-1f5399f91922', '92fbdd9c-09de-5dc2-aa48-172c55dd68b6', 1, 'réuni', false),
  ('762a67ac-f9ba-5fc2-90d2-aaffd4268e3f', '92fbdd9c-09de-5dc2-aa48-172c55dd68b6', 2, 'réunis', true),
  ('5c3d5dbf-e434-57ed-8abf-b1990fbd6577', '92fbdd9c-09de-5dc2-aa48-172c55dd68b6', 3, 'réunir', false),
  ('3bd2ac2c-4814-52e1-ad68-a8d2290b2898', '1777461c-cbe5-5da1-b4ef-5649bc8959cf', 1, 'Merci ! À plus tard.', false),
  ('930508fd-3fdb-5683-86b9-1af3759ae96d', '1777461c-cbe5-5da1-b4ef-5649bc8959cf', 2, 'Je vous remercie de votre retour. Je reste à votre disposition et attends votre réponse avant vendredi.', true),
  ('25597d10-569d-5fe1-b01a-ad151d6ad2f4', '1777461c-cbe5-5da1-b4ef-5649bc8959cf', 3, 'OK, dites-moi quand vous saurez.', false),
  ('90b73704-b888-51ea-a748-4e274a3d03c7', 'f07e8761-5948-5049-aa6b-a15518559ee2', 1, 'Bisous,', false),
  ('85f16aac-2ca0-567c-bdc2-09daf6a69c80', 'f07e8761-5948-5049-aa6b-a15518559ee2', 2, 'Cordialement,', true),
  ('771c134a-0b52-50f7-984e-87b2c2ab2c82', 'f07e8761-5948-5049-aa6b-a15518559ee2', 3, 'À toute,', false),
  ('ee58b758-6f44-5244-aeb3-5acdf7e7321f', '267554b3-21db-50d4-966a-fc36640871f4', 1, 'joint', true),
  ('fc31aeac-b7cc-5eae-ad7c-24148cf990fc', '267554b3-21db-50d4-966a-fc36640871f4', 2, 'joignant', false),
  ('b9a9679d-b095-5a43-a229-5569efaf42f0', '267554b3-21db-50d4-966a-fc36640871f4', 3, 'jointe', false),
  ('bdf073d2-eba4-57b1-a42a-a37974eb12b0', '290467d5-cbb0-595e-9604-0bdd77c3b580', 1, 'C''est faux.', false),
  ('9c85312d-a7bd-57f7-a35f-afffeb363656', '290467d5-cbb0-595e-9604-0bdd77c3b580', 2, 'Je ne suis pas tout à fait d''accord — puis-je proposer une autre approche ?', true),
  ('a1da0f32-e100-58ba-8548-cb1242f2f15c', '290467d5-cbb0-595e-9604-0bdd77c3b580', 3, 'Vous ne comprenez pas le problème.', false),
  ('91f8b012-b1d8-51c7-8594-888f7660c1a7', '0e3bee83-30cc-57ac-9b2f-5c2f7e273e69', 1, 'Laissez-moi terminer, je vous écoute juste après.', true),
  ('520a764e-90d2-58cc-8a71-f05beb06c5b9', '0e3bee83-30cc-57ac-9b2f-5c2f7e273e69', 2, 'Ne me coupez pas la parole.', false),
  ('78526ae3-86c7-56e0-adf0-f67b98484412', '0e3bee83-30cc-57ac-9b2f-5c2f7e273e69', 3, 'Non, rien, allez-y.', false),
  ('21966a55-4f77-5ed4-8074-a7d70b7d9ba0', '907dc7ed-0f09-5414-a526-b764730caea3', 1, 'Bon, on passe à autre chose.', false),
  ('c7a8f3ae-77d0-52c3-9c09-148429802de9', '907dc7ed-0f09-5414-a526-b764730caea3', 2, 'Peut-on noter ce point et y revenir jeudi avec les chiffres ?', true),
  ('fedfb40f-b649-58dd-bc3e-0af11e838846', '907dc7ed-0f09-5414-a526-b764730caea3', 3, 'On en parle depuis trop longtemps.', false),
  ('61f4cee0-c5a3-5c2e-80ce-d943d7a54ef3', '8739f293-0136-53bf-a24b-3b2ac3cf6934', 1, 'Bonjour à tous, je m''appelle Thabo et je vais vous parler de plusieurs choses.', false),
  ('724b15e1-2837-53f6-842e-51c34ee516fc', '8739f293-0136-53bf-a24b-3b2ac3cf6934', 2, 'En cinq minutes, je vais vous montrer pourquoi nos délais ont glissé et comment y remédier.', true),
  ('d6d2015d-7504-531e-9c3f-1a9309c82898', '8739f293-0136-53bf-a24b-3b2ac3cf6934', 3, 'Merci beaucoup d''être venus, j''apprécie vraiment votre temps.', false),
  ('e9973497-4c62-54e3-b555-0574c88b3421', '699cf3a4-a4fa-5693-80d7-637ad25203d3', 1, 'Et voilà, aussi…', false),
  ('901b6316-167c-52fa-aa7e-59027432d9c3', '699cf3a4-a4fa-5693-80d7-637ad25203d3', 2, 'Voilà pour les coûts. Passons maintenant aux effectifs.', true),
  ('e1e4a13a-bc8d-55a5-98e4-dc600d54a022', '699cf3a4-a4fa-5693-80d7-637ad25203d3', 3, 'Diapositive suivante.', false),
  ('6672f852-f8b0-56dd-b61a-c35e71c9b54e', 'eaee4f95-7465-51c0-9373-d58115181f1c', 1, 'Je n''ai pas ce chiffre sous la main, je vous l''envoie jeudi.', true),
  ('56941602-d6e9-5edd-83ee-6f10c7140f76', 'eaee4f95-7465-51c0-9373-d58115181f1c', 2, 'Je crois que c''est environ vingt pour cent…', false),
  ('59059866-9ec1-5dca-b206-835fd0e53454', 'eaee4f95-7465-51c0-9373-d58115181f1c', 3, 'Ce n''est pas mon service.', false),
  ('18abb7f3-e124-5dde-aade-cfccddaa6c90', '2c718185-e14c-54c5-8812-0c53fbeaa08c', 1, 'Can I help you find something?', true),
  ('b37e87a1-f834-54e6-908a-fec54ca7ab32', '2c718185-e14c-54c5-8812-0c53fbeaa08c', 2, 'Would you like a bag?', false),
  ('0e2ba6ec-2bdd-527b-a090-5b71e1c25b5f', '2c718185-e14c-54c5-8812-0c53fbeaa08c', 3, 'Are you paying by card?', false),
  ('a257b8c6-d036-54a9-bb43-0ffeb693f925', '4afbb1c2-69dd-589b-9be5-94480a808caf', 1, 'Je suis bien, merci.', false),
  ('8f89563e-34ab-53d4-81f9-5a35c06f8e2d', '4afbb1c2-69dd-589b-9be5-94480a808caf', 2, 'Ça va, merci — et toi ?', true),
  ('e0c6b3e0-dea1-5d18-a3fa-0ff8ccbcd590', '4afbb1c2-69dd-589b-9be5-94480a808caf', 3, 'Il va bien dans ma vie.', false),
  ('b59d0c40-77b9-54d0-b12f-504c7d12ba46', 'e23cd0ac-80b8-54a5-8a18-56a18c3eebf8', 1, 'Répétez.', false),
  ('2f9dec12-2af3-5389-9cb9-213313d6bc27', 'e23cd0ac-80b8-54a5-8a18-56a18c3eebf8', 2, 'Pardon, vous pouvez répéter s''il vous plaît ?', true),
  ('c2032f24-fb8d-5f3d-8a7c-a0ad01cc5386', 'e23cd0ac-80b8-54a5-8a18-56a18c3eebf8', 3, 'Quoi vous avez dit ?', false),
  ('f92c3838-1eb1-5f63-bcab-f9fe9fd3f928', '02ac9871-f4d4-5f9d-8c6b-59b0fd3de7b6', 1, '10 h 30', true),
  ('d355c3e2-41a5-54aa-8e3a-5a6ce3f83b5a', '02ac9871-f4d4-5f9d-8c6b-59b0fd3de7b6', 2, '10 h 00', false),
  ('3a5be3de-25d9-552d-9854-6f650b8a52f7', '02ac9871-f4d4-5f9d-8c6b-59b0fd3de7b6', 3, '9 h 30', false),
  ('610e160e-401c-50e5-82f4-1b28ccabbe79', '32190c5a-8f3a-59f0-bfd6-0c0342773315', 1, 'Pourrait-on décaler la réunion de mardi à mercredi, à la même heure ?', true),
  ('81434749-817b-5688-80b5-5b5fe29d26f7', '32190c5a-8f3a-59f0-bfd6-0c0342773315', 2, 'Mardi, c''est compliqué pour moi.', false),
  ('33bb4f16-4e8b-5f53-a0ad-8cd980f40a43', '32190c5a-8f3a-59f0-bfd6-0c0342773315', 3, 'Je ne suis pas sûr pour mardi, on verra.', false),
  ('77522431-313b-5602-b44c-1fc9adcb9e06', 'b4b10cfc-efa5-581c-b21c-f6343960bbde', 1, 'Super, à bientôt !', false),
  ('a10d9820-b5a5-5400-97bb-7032d1a1771e', 'b4b10cfc-efa5-581c-b21c-f6343960bbde', 2, 'C''est noté : mercredi 14 août, 10 h 30, dans vos bureaux.', true),
  ('c4045e8a-ca2d-56b0-b22a-af853003361d', 'b4b10cfc-efa5-581c-b21c-f6343960bbde', 3, 'OK, c''est bon.', false)
on conflict (id) do nothing;

insert into placement_questions (id, course_id, skill, tag, context, prompt, sort_order) values
  ('40bf5cfc-c4bb-5841-b813-8a4ba770be10', '4031a033-95ff-5278-85a3-253e74434a3a', 'Grammar', 'Précision', NULL, 'Complete: « J''___ à Paris depuis trois ans. »', 1),
  ('e2033168-9149-5c73-8932-1a6997020cca', '4031a033-95ff-5278-85a3-253e74434a3a', 'Vocabulary', 'Choix du mot', NULL, 'Complete: « Nous devons finaliser le ___ avant vendredi. »', 2),
  ('cf7982b0-56c0-5132-9ffa-a26cc1e0bf7c', '4031a033-95ff-5278-85a3-253e74434a3a', 'Reading', 'Compréhension', '« La date limite est avancée à jeudi. Merci de transmettre votre partie mercredi en fin de journée afin que nous puissions la relire ensemble. »', 'What does the writer want you to do?', 3),
  ('ad69f676-d42e-5b50-a72c-ac2d1bdc9ab1', '4031a033-95ff-5278-85a3-253e74434a3a', 'Writing', 'Registre', NULL, 'You are emailing a manager you have never met. Which opening fits best?', 4),
  ('f2489312-3583-5896-8bda-159a6010e8e8', '4031a033-95ff-5278-85a3-253e74434a3a', 'Listening', 'Détail', 'Vous entendez : « La réunion est déplacée en salle 2, on commence à neuf heures et quart. »', 'When and where does the meeting start?', 5),
  ('08e4bee6-3075-5313-a82b-89db4ef9b683', '4031a033-95ff-5278-85a3-253e74434a3a', 'Speaking', 'Réponse', NULL, 'A colleague asks you to take the minutes, but you are presenting. What is the best reply?', 6)
on conflict (id) do nothing;

insert into placement_options (id, question_id, sort_order, body, points) values
  ('7961f8eb-360b-5f0e-850a-0817e3ef10ab', '40bf5cfc-c4bb-5841-b813-8a4ba770be10', 1, 'ai habité', 1),
  ('b3b2a506-f12a-5137-befc-7d3919aa2393', '40bf5cfc-c4bb-5841-b813-8a4ba770be10', 2, 'habite', 2),
  ('b1d450ef-60a4-5e06-960e-0df2ce60bd46', '40bf5cfc-c4bb-5841-b813-8a4ba770be10', 3, 'habitais', 0),
  ('751ab05a-9404-576b-abff-d9db8321ac86', 'e2033168-9149-5c73-8932-1a6997020cca', 1, 'contrat', 2),
  ('20356254-677e-5f6c-ba99-2395054bec3c', 'e2033168-9149-5c73-8932-1a6997020cca', 2, 'contact', 0),
  ('640e6fb8-1533-510d-bec1-8e19c1184072', 'e2033168-9149-5c73-8932-1a6997020cca', 3, 'contraste', 1),
  ('d38610a7-ccb7-5fc1-90c5-f8e26721ae6f', 'cf7982b0-56c0-5132-9ffa-a26cc1e0bf7c', 1, 'Envoyer votre partie mercredi soir.', 2),
  ('78a18999-72ec-5ce5-b3d2-6a5884b772de', 'cf7982b0-56c0-5132-9ffa-a26cc1e0bf7c', 2, 'Relire tout le document jeudi.', 1),
  ('74777da7-8de4-594e-901d-d1feb4d04577', 'cf7982b0-56c0-5132-9ffa-a26cc1e0bf7c', 3, 'Attendre confirmation de la date.', 0),
  ('6070ee6f-c197-546b-b46e-7183068ed1ba', 'ad69f676-d42e-5b50-a72c-ac2d1bdc9ab1', 1, 'Salut !', 0),
  ('29b817f9-e7b4-50fc-a610-5d7788230f90', 'ad69f676-d42e-5b50-a72c-ac2d1bdc9ab1', 2, 'Madame, Monsieur,', 2),
  ('521b7731-4490-5c31-a8a8-2c76c44d1c45', 'ad69f676-d42e-5b50-a72c-ac2d1bdc9ab1', 3, 'Bonjour, je vous écris pour la poste vacante.', 1),
  ('d3f6ac3f-6a9d-561f-8aee-215b68d4f613', 'f2489312-3583-5896-8bda-159a6010e8e8', 1, '9 h 15, salle 2', 2),
  ('18210326-8a2c-59af-9113-16e677654366', 'f2489312-3583-5896-8bda-159a6010e8e8', 2, '9 h 00, salle 2', 1),
  ('492bcf84-c159-5ba4-8822-e41b101d072e', 'f2489312-3583-5896-8bda-159a6010e8e8', 3, '9 h 15, salle 1', 0),
  ('f6490821-3b5b-5314-9dbc-658f9fd42aaf', '08e4bee6-3075-5313-a82b-89db4ef9b683', 1, 'Non, je ne peux pas.', 0),
  ('c84c2a34-e8a9-5711-a5a6-56839519f222', '08e4bee6-3075-5313-a82b-89db4ef9b683', 2, 'Je présente aujourd''hui, je ne pourrai pas — Lucie pourrait-elle s''en charger ?', 2),
  ('655963f3-b305-52f7-b0e1-7dc567eb8d13', '08e4bee6-3075-5313-a82b-89db4ef9b683', 3, 'Peut-être, on verra.', 1)
on conflict (id) do nothing;

insert into vocabulary (id, course_id, word, part_of_speech, definition, example, sort_order) values
  ('1323734f-5ae2-5604-96b2-3897073f6d91', '4031a033-95ff-5278-85a3-253e74434a3a', 'négocier', 'verbe', 'Discuter afin de parvenir à un accord.', 'Nous avons négocié un meilleur tarif avec le fournisseur.', 1),
  ('dab7ef9f-8298-55ad-b4bc-cd9e751e5e89', '4031a033-95ff-5278-85a3-253e74434a3a', 'mettre en œuvre', 'locution verbale', 'Appliquer concrètement un plan ou une décision.', 'L''équipe va mettre en œuvre le nouveau planning dès lundi.', 2),
  ('e3bb62ab-f761-58f7-be57-098eb9fc718e', '4031a033-95ff-5278-85a3-253e74434a3a', 'animer', 'verbe', 'Conduire une réunion ou un atelier.', 'Grace va animer l''atelier jeudi matin.', 3),
  ('a0419608-cbbf-57ff-bbd7-e1b85b24c342', '4031a033-95ff-5278-85a3-253e74434a3a', 'faire le point', 'locution verbale', 'Examiner où en est un dossier.', 'Faisons le point sur le dossier avant la réunion.', 4),
  ('be28dbf5-c1b5-5311-a90e-6f484faeda9a', '4031a033-95ff-5278-85a3-253e74434a3a', 'une facture', 'nom féminin', 'Document indiquant la somme due pour des biens ou services.', 'La facture est payable à trente jours.', 5),
  ('e3f56517-e8ad-5c64-bb24-c64ea5025c53', '4031a033-95ff-5278-85a3-253e74434a3a', 'une échéance', 'nom féminin', 'Date limite à laquelle une tâche doit être terminée.', 'L''échéance a été avancée, nous avons livré mercredi.', 6),
  ('d9349e27-00d9-5775-b1e6-b267082f429e', '4031a033-95ff-5278-85a3-253e74434a3a', 'déléguer', 'verbe', 'Confier une tâche ou une responsabilité à quelqu''un.', 'Elle délègue l''inventaire à l''équipe du magasin.', 7),
  ('edd9274a-b92e-5ba5-a179-3288e5324182', '4031a033-95ff-5278-85a3-253e74434a3a', 'relancer', 'verbe', 'Recontacter quelqu''un au sujet d''une demande en attente.', 'Je relancerai les RH si je n''ai pas de réponse vendredi.', 8)
on conflict (id) do nothing;

insert into practice_modules (id, course_id, slug, name, icon, description, tone, target_screen, sort_order) values
  ('7b2073b1-b8e8-5a30-9f5e-7f96c97011be', '4031a033-95ff-5278-85a3-253e74434a3a', 'fr-sp', 'Expression orale', 'mic', 'Conversations professionnelles simulées et travail de la prononciation.', 'terra', 'tutor', 1),
  ('b6441d3f-f377-58b9-82b7-de9ef201d28f', '4031a033-95ff-5278-85a3-253e74434a3a', 'fr-wr', 'Expression écrite', 'doc', 'Courriels, comptes rendus et argumentation.', 'ochre', 'path', 2),
  ('5d6af509-5913-5653-8066-f8c8f4f2c3a7', '4031a033-95ff-5278-85a3-253e74434a3a', 'fr-li', 'Compréhension orale', 'head', 'Réunions, annonces et conversations courantes.', 'green', 'path', 3),
  ('d394a8d2-d115-5c49-bc1a-d48b8f13f256', '4031a033-95ff-5278-85a3-253e74434a3a', 'fr-re', 'Compréhension écrite', 'book', 'Articles, notes de service et documents administratifs.', 'quiet', 'path', 4)
on conflict (id) do nothing;

insert into practice_exercises (id, practice_module_id, title, sort_order) values
  ('06d27560-4ee2-51f6-9ed0-70b38a4da047', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 1', 1),
  ('d8994179-cf8e-5c8a-80e2-5ba1807e917d', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 2', 2),
  ('fff4d4ab-f3a8-5019-b684-2db686784fbb', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 3', 3),
  ('f5e79bf4-931c-5ae7-ae35-d5ffc1a70833', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 4', 4),
  ('1b575421-9038-58b7-8c0a-2d214461f3db', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 5', 5),
  ('e929a6a6-c0a2-5cc9-b9a2-01402bef56d5', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 6', 6),
  ('9a27b4a9-4fd0-579b-884b-3bbdffc2b004', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 7', 7),
  ('59ac8762-0d81-5dad-bc5e-2cf99eabd398', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 8', 8),
  ('eca2e89c-4ef0-545c-aea5-ce18aacd3cc7', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 9', 9),
  ('d282b985-b12d-535a-9ada-f6306145f941', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 10', 10),
  ('c0f6084f-5a3f-580d-9058-868b291f42b7', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 11', 11),
  ('9d6839cc-b9c2-5217-929b-031f6b8e1072', '7b2073b1-b8e8-5a30-9f5e-7f96c97011be', 'Expression orale — exercice 12', 12),
  ('534e90eb-b6b3-5b2f-b2cd-71779e0078cc', 'b6441d3f-f377-58b9-82b7-de9ef201d28f', 'Expression écrite — exercice 1', 1),
  ('c30f601e-9bbc-5b06-a855-709cda78bed8', 'b6441d3f-f377-58b9-82b7-de9ef201d28f', 'Expression écrite — exercice 2', 2),
  ('6fdeab81-0570-5ab0-97d9-50e56708751f', 'b6441d3f-f377-58b9-82b7-de9ef201d28f', 'Expression écrite — exercice 3', 3),
  ('1179dd4e-13a3-5bdd-819f-bb3e32b2c3c5', 'b6441d3f-f377-58b9-82b7-de9ef201d28f', 'Expression écrite — exercice 4', 4),
  ('b0b2846c-fa58-5355-b1ac-232b5db06963', 'b6441d3f-f377-58b9-82b7-de9ef201d28f', 'Expression écrite — exercice 5', 5),
  ('aa6a9970-f48b-58b7-9aa3-913a677eeb8f', 'b6441d3f-f377-58b9-82b7-de9ef201d28f', 'Expression écrite — exercice 6', 6),
  ('716004b9-0e7c-5d1a-8aa9-d604a7a163b8', 'b6441d3f-f377-58b9-82b7-de9ef201d28f', 'Expression écrite — exercice 7', 7),
  ('a0c59154-6e6c-59e1-9abf-8183c3508471', 'b6441d3f-f377-58b9-82b7-de9ef201d28f', 'Expression écrite — exercice 8', 8),
  ('773e9dfa-b6e7-53eb-9ab4-34e4e45aa5d0', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 1', 1),
  ('781f85d6-de1d-54cc-9526-cfb4739f4083', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 2', 2),
  ('b302fe10-9161-51c4-96ed-b59342171b69', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 3', 3),
  ('fadb3ef1-417c-5c47-8101-36dca62aaed1', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 4', 4),
  ('d1861df6-af4b-5038-bf7d-fea8218ad7f0', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 5', 5),
  ('63335cc1-628b-5f07-8bc5-859a4537ccd5', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 6', 6),
  ('ab750758-8a62-5817-95d0-a2a179cb8838', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 7', 7),
  ('fa69d0d8-f955-596f-a0e4-3aa12308ed9a', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 8', 8),
  ('985ec352-949d-56dd-8a61-76de05e53491', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 9', 9),
  ('1855901e-8124-5226-801c-f2d4fa90bce4', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 10', 10),
  ('05b76180-3853-512b-9dd3-b525cd124a9b', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 11', 11),
  ('68cd012a-7062-59ba-a274-56f8b3c02c4a', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 12', 12),
  ('c6c92255-2af6-58bf-92fc-6646b0cae55f', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 13', 13),
  ('fc2e615e-bb58-5bcf-908f-6be27c0facd7', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 14', 14),
  ('386d29fe-85f6-5c12-aeee-a5e86e11db83', '5d6af509-5913-5653-8066-f8c8f4f2c3a7', 'Compréhension orale — exercice 15', 15),
  ('9b6c0b59-0120-5a84-93eb-70b5f73c8594', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 1', 1),
  ('3e2481ca-3a5b-501b-bc66-3b61f73bb02a', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 2', 2),
  ('eb6b1cac-e4f1-54d6-affe-0d82350b1ff8', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 3', 3),
  ('bc967e6d-ceb2-539f-a633-fcc047d75677', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 4', 4),
  ('99430ecc-f2cd-5ab0-a601-da6319e8fe08', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 5', 5),
  ('71c8eb5b-125e-5a44-8e33-e56793611c46', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 6', 6),
  ('e12d3bac-d945-56bb-8f17-b8ea62bb1220', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 7', 7),
  ('42d8ef2a-1a9c-5fbf-850f-b2f44c1aec6c', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 8', 8),
  ('811b2946-2122-501e-bdfc-370fd855d37a', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 9', 9),
  ('a7967633-5c7a-5d52-80a1-10c982c2ecf1', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 10', 10),
  ('f37b1cfb-b082-505e-95bc-54d543a4a187', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 11', 11),
  ('0a47543a-065d-5341-b4b4-02128f411282', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 12', 12),
  ('5f0c2fb5-245e-5f93-a97f-6353516b90e4', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 13', 13),
  ('7f0dd500-f0cc-5c56-9ebf-5eb45f2a5074', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 14', 14),
  ('04f7e74d-4c64-521c-972a-55cb3ac00dc6', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 15', 15),
  ('ebc26375-fea4-5a7f-9baf-3a085b7cb96c', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 16', 16),
  ('856a0bb7-b3ea-5e68-b640-d8198a7c4be2', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 17', 17),
  ('63ef6e6e-c66a-52ae-b72a-0db800e32ad7', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 18', 18),
  ('cdc576c4-e388-565a-aff4-a924162b4a65', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 19', 19),
  ('e1274944-7f25-58f4-a617-6695ddec35e5', 'd394a8d2-d115-5c49-bc1a-d48b8f13f256', 'Compréhension écrite — exercice 20', 20)
on conflict (id) do nothing;

insert into tutor_scenarios (id, course_id, slug, title, level_code, sort_order) values
  ('f71462aa-d110-5222-bb98-317f8a9e05f6', '4031a033-95ff-5278-85a3-253e74434a3a', 'fr-entretien', 'Entretien d''embauche', 'B1', 1)
on conflict (id) do nothing;

insert into tutor_turns (id, scenario_id, sort_order, goal, prompt, follow_up) values
  ('89e59ff1-ee89-50ac-9264-a2395a554751', 'f71462aa-d110-5222-bb98-317f8a9e05f6', 1, 'Se présenter', 'Bonjour et bienvenue à cet entretien d''entraînement. Commençons simplement : pouvez-vous vous présenter ?', 'Bon début. La structure est claire : nom, métier, ville, motivation. Précisons maintenant votre expérience.'),
  ('5b8d40d4-f096-503f-85a3-f862421d18bf', 'f71462aa-d110-5222-bb98-317f8a9e05f6', 2, 'Décrire son expérience', 'Depuis combien de temps travaillez-vous dans ce domaine, et sur quels projets ?', 'Très bien. Les recruteurs retiennent les détails concrets : un client, un résultat, une échelle.'),
  ('6ad03b35-049d-5163-b0a7-ac4614432c8b', 'f71462aa-d110-5222-bb98-317f8a9e05f6', 3, 'Gérer une question difficile', 'Parlez-moi d''un projet qui ne s''est pas passé comme prévu. Qu''avez-vous fait ?', 'Belle conclusion. Vous êtes resté centré sur vos actions et sur ce qui a changé ensuite.')
on conflict (id) do nothing;

insert into tutor_replies (id, turn_id, sort_order, body, score, feedback_kind, feedback_body, fix_before, fix_after) values
  ('ea44a1b3-3c86-5255-b221-1e2c46361fd5', '89e59ff1-ee89-50ac-9264-a2395a554751', 1, 'Bonjour, je m''appelle David. Je suis développeur à Lagos et j''aime créer des applications utiles.', 3, 'good', 'Nom, poste, ville, motivation — exactement ce qu''attend un recruteur.', NULL, NULL),
  ('b8c7e827-fa1e-56fc-b2ab-40598c6a4d58', '89e59ff1-ee89-50ac-9264-a2395a554751', 2, 'Je suis développer des applications depuis trois ans.', 1, 'fix', NULL, 'Je suis développer des applications', 'Je développe des applications'),
  ('7a1ebfcc-6da7-529f-958e-209c60c2258c', '89e59ff1-ee89-50ac-9264-a2395a554751', 3, 'Développeur.', 1, 'note', 'Trop court. Une réponse d''un mot est lue comme un manque d''assurance — ajoutez une phrase de contexte.', NULL, NULL),
  ('a4fda1f8-ea15-54f7-970f-a7f4c4043379', '5b8d40d4-f096-503f-85a3-f862421d18bf', 1, 'Je développe depuis environ trois ans, surtout des applications mobiles pour de petites entreprises.', 3, 'good', '« Depuis » avec le présent : le bon temps pour une activité commencée dans le passé et toujours en cours.', NULL, NULL),
  ('54cca704-89b3-584d-ae6b-fc8d6415836e', '5b8d40d4-f096-503f-85a3-f862421d18bf', 2, 'Depuis trois ans j''ai développé des applications mobiles.', 1, 'fix', NULL, 'Depuis trois ans j''ai développé', 'Depuis trois ans je développe'),
  ('d1a3bb70-caad-56b5-a7f5-377865463d33', '5b8d40d4-f096-503f-85a3-f862421d18bf', 3, 'Trois ans. Applications mobiles.', 2, 'note', 'Exact mais télégraphique. Ajoutez un exemple concret.', NULL, NULL),
  ('6a51bce3-6248-5fbd-b433-74707a08dd94', '6ad03b35-049d-5163-b0a7-ac4614432c8b', 1, 'Notre application de livraison est sortie avec un bug de paiement. J''ai annulé la mise en production, corrigé le soir même et ajouté un test.', 3, 'good', 'Problème, action, prévention — la structure que les recruteurs attendent.', NULL, NULL),
  ('9fb8f032-27d4-5a54-8366-2c95bfbab354', '6ad03b35-049d-5163-b0a7-ac4614432c8b', 2, 'Rien ne se passe mal dans mes projets, je suis très rigoureux.', 0, 'note', 'Cela paraît défensif. La question sert à voir comment vous réagissez, pas si vous êtes parfait.', NULL, NULL),
  ('4caad538-9063-5bb4-b580-0efa37060379', '6ad03b35-049d-5163-b0a7-ac4614432c8b', 3, 'Il y avait un bug et mon chef était très en colère contre l''équipe.', 1, 'note', 'Restez sur vos actions plutôt que sur les réactions des autres. Qu''avez-vous fait ensuite ?', NULL, NULL)
on conflict (id) do nothing;

-- ===== Português profissional e do dia a dia =====
insert into courses (id, language_id, code, title, description, sort_order) values
  ('d18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'e0c8bd54-e891-570d-bf2e-a95ebde9bc11', 'workplace-portuguese', 'Português profissional e do dia a dia', 'Português prático para a comunicação profissional e a vida quotidiana.', 1)
on conflict (id) do nothing;

insert into modules (id, course_id, slug, title, icon, blurb, sort_order) values
  ('6d1c5f8e-75a6-5365-92dd-010b6549cba9', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'pt-m1', 'O mundo do trabalho', 'case', 'Comunicação profissional no escritório, no terreno e com clientes.', 1),
  ('18c8ca2a-7807-52e9-a128-9a266088c124', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'pt-m2', 'A vida quotidiana', 'users', 'Português do dia a dia: serviços, vizinhos e tratar de assuntos.', 2)
on conflict (id) do nothing;

insert into lessons (id, module_id, slug, title, tag, description, est_minutes, sort_order) values
  ('054ebfad-d916-51fd-8439-f110ad4258d8', '6d1c5f8e-75a6-5365-92dd-010b6549cba9', 'pt-l1', 'Estruturas e concordância', 'Gramática', 'Construir frases com nuance e concordar corretamente.', 15, 1),
  ('c26aa46a-d99e-572c-850c-e3333adc71a1', '6d1c5f8e-75a6-5365-92dd-010b6549cba9', 'pt-l2', 'Correio eletrónico profissional', 'Escrita', 'Redigir mensagens claras, corteses e eficazes.', 15, 2),
  ('2e7c9e6f-71e4-5abd-a2b8-c183b54f07fc', '6d1c5f8e-75a6-5365-92dd-010b6549cba9', 'pt-l3', 'Participar numa reunião', 'Oralidade', 'Intervir, discordar com tacto e fazer avançar a discussão.', 15, 3),
  ('b177878d-5a28-51e3-962c-2f94e956e1c2', '6d1c5f8e-75a6-5365-92dd-010b6549cba9', 'pt-l4', 'Fazer uma apresentação', 'Oralidade', 'Abrir, estruturar e fechar uma apresentação curta.', 15, 4),
  ('e2064094-7fe1-54c9-9c86-ae2ff8959112', '18c8ca2a-7807-52e9-a128-9a266088c124', 'pt-l5', 'Interações do dia a dia', 'Oralidade', 'Cumprimentar, pedir e reagir com naturalidade.', 15, 1),
  ('8611c9a5-6a2d-5d8d-ad69-588b2ee6c272', '18c8ca2a-7807-52e9-a128-9a266088c124', 'pt-l6', 'Marcar encontros', 'Compreensão oral', 'Combinar horas, confirmar planos e lidar com alterações.', 15, 2)
on conflict (id) do nothing;

insert into lesson_questions (id, lesson_id, sort_order, prompt, explanation, quote_from, quote_text, audio_url) values
  ('eebadb26-6d03-5f82-a2ae-35725ca12f62', '054ebfad-d916-51fd-8439-f110ad4258d8', 1, 'Which sentence is correct?', 'With « desde », Portuguese uses the present tense for something that began in the past and continues now.', NULL, NULL, NULL),
  ('e6775ff0-75fb-5fca-953c-61530d986d79', '054ebfad-d916-51fd-8439-f110ad4258d8', 2, 'Complete: « Embora o projeto ___ atrasado, cumprimos o prazo. »', '« Embora » requires the subjunctive, so « estivesse » is the correct form.', NULL, NULL, NULL),
  ('999c5019-c21c-593a-80ab-9d6b7fcdcb2e', '054ebfad-d916-51fd-8439-f110ad4258d8', 3, 'Complete: « Nós ___ reunimos às nove horas. »', 'The reflexive pronoun agrees with the subject: « nós » takes « nos ».', NULL, NULL, NULL),
  ('8116f9e8-eff2-542c-85d7-83dbc14b25b2', 'c26aa46a-d99e-572c-850c-e3333adc71a1', 1, 'You interviewed at a logistics company in Maputo. Read the message and choose the most appropriate formal reply.', 'It acknowledges the message, keeps a formal register, and repeats the timeline so both sides agree on what happens next.', 'Departamento de Recursos Humanos', 'Agradecemos a sua candidatura. Daremos uma resposta até sexta-feira da próxima semana.', 'simulated'),
  ('95e50b4e-bd8e-5dd7-ae49-8136425f7514', 'c26aa46a-d99e-572c-850c-e3333adc71a1', 2, 'Which sign-off is standard in a formal email?', '« Com os melhores cumprimentos » is the standard professional close; the others are for friends.', NULL, NULL, NULL),
  ('2569aa45-a3ff-5115-afcb-9a6a5975461b', 'c26aa46a-d99e-572c-850c-e3333adc71a1', 3, 'Complete: « Segue em ___ o relatório. »', '« Em anexo » is the fixed expression used for attachments in professional email.', NULL, NULL, NULL),
  ('88dbff2c-7c64-5cd9-91fd-4d0d603ee22f', '2e7c9e6f-71e4-5abd-a2b8-c183b54f07fc', 1, 'You want to disagree with your manager in a meeting. Which phrasing keeps the room comfortable?', 'Framing it as your own view and asking permission invites discussion instead of defence.', NULL, NULL, NULL),
  ('168cc302-3108-5e20-907d-9f791ce66490', '2e7c9e6f-71e4-5abd-a2b8-c183b54f07fc', 2, 'Someone interrupts you mid-point. What do you say?', 'It holds your turn and hands it over deliberately — assertive without being sharp.', NULL, NULL, NULL),
  ('af576c2b-bdee-5706-8861-88aa4e48d4db', '2e7c9e6f-71e4-5abd-a2b8-c183b54f07fc', 3, 'Which phrase moves a stuck discussion forward?', 'Parking the item with a concrete next step closes it without dismissing anyone''s point.', NULL, NULL, NULL),
  ('b1df04b6-3fa0-5ed6-9ec0-8fefc4a333d6', 'b177878d-5a28-51e3-962c-2f94e956e1c2', 1, 'Which opening orients the audience fastest?', 'It states duration, topic and payoff, so the audience knows immediately why to listen.', NULL, NULL, NULL),
  ('3955b117-2b8b-5236-a73a-43b26cabb0a0', 'b177878d-5a28-51e3-962c-2f94e956e1c2', 2, 'You are moving to your second point. Which signpost is clearest?', 'Closing one idea before naming the next helps listeners follow the structure without the slides.', NULL, NULL, NULL),
  ('3afe4bb4-1f52-55d1-b327-857150b0e60f', 'b177878d-5a28-51e3-962c-2f94e956e1c2', 3, 'Someone asks a question you cannot answer. Best response?', 'Admitting the gap and committing to a date protects your credibility; guessing at figures destroys it.', NULL, NULL, NULL),
  ('b01fff81-a94b-510b-a8cf-aafd48bed116', 'e2064094-7fe1-54c9-9c86-ae2ff8959112', 1, 'A shop assistant asks « Já está a ser atendido? » What does she mean?', 'It is a fixed service phrase meaning « has someone already started helping you? ».', NULL, NULL, NULL),
  ('25a5d066-bea5-5d0c-ba48-6a9922a9cefb', 'e2064094-7fe1-54c9-9c86-ae2ff8959112', 2, 'Choose the natural reply to « Tudo bem? » from a neighbour.', 'Casual greetings take short, elliptical answers; the textbook version sounds stiff between neighbours.', NULL, NULL, NULL),
  ('49f15ab8-4f95-50e5-b974-d4f7febc28b6', 'e2064094-7fe1-54c9-9c86-ae2ff8959112', 3, 'You did not catch what someone said. Which is most natural?', '« Desculpe, pode repetir… » is the standard polite repair phrase.', NULL, NULL, NULL),
  ('750db954-b6f1-5feb-8e32-649afd2a61b9', '8611c9a5-6a2d-5d8d-ad69-588b2ee6c272', 1, 'You hear: « Fica combinado às dez e meia? » What time is proposed?', '« Dez e meia » is half past ten — the hour comes first, then « e meia ».', NULL, NULL, 'simulated'),
  ('332c17da-5774-551c-836b-0b2fdee61e3d', '8611c9a5-6a2d-5d8d-ad69-588b2ee6c272', 2, 'You need to move a meeting. Which is clearest on the phone?', 'It names the change and offers a specific alternative, so the other person can agree in one word.', NULL, NULL, NULL),
  ('23899ebe-68b9-5e10-9645-cfe94aeabec1', '8611c9a5-6a2d-5d8d-ad69-588b2ee6c272', 3, 'Confirming a plan, which is most reliable?', 'Repeating date, time and place prevents the most common cause of missed meetings.', NULL, NULL, NULL)
on conflict (id) do nothing;

insert into lesson_options (id, question_id, sort_order, body, is_correct) values
  ('9e10e163-0525-5ab2-b97b-cbd4a5789273', 'eebadb26-6d03-5f82-a2ae-35725ca12f62', 1, 'Ela trabalhando aqui desde 2019.', false),
  ('e68ea43c-3b3b-5ebb-a0bf-26a83113f90c', 'eebadb26-6d03-5f82-a2ae-35725ca12f62', 2, 'Ela trabalha aqui desde 2019.', true),
  ('b7afa02f-ec26-58d5-929a-b395fa30e814', 'eebadb26-6d03-5f82-a2ae-35725ca12f62', 3, 'Ela trabalhou aqui desde 2019.', false),
  ('cd13f3ed-1faf-559a-883b-f20ab43cd85e', 'e6775ff0-75fb-5fca-953c-61530d986d79', 1, 'estivesse', true),
  ('6b735cf4-0a5b-52bd-b078-94f4d19e5b12', 'e6775ff0-75fb-5fca-953c-61530d986d79', 2, 'estava', false),
  ('e30c3a79-34f2-5782-91c0-0a251e4b11fa', 'e6775ff0-75fb-5fca-953c-61530d986d79', 3, 'está', false),
  ('f020a480-2847-5fae-a2fb-9888a73becea', '999c5019-c21c-593a-80ab-9d6b7fcdcb2e', 1, 'se', false),
  ('2415ebe7-23de-5767-b5ee-a9c2a02af782', '999c5019-c21c-593a-80ab-9d6b7fcdcb2e', 2, 'nos', true),
  ('e84c448c-e3e4-5532-b4b8-6f2053e5817c', '999c5019-c21c-593a-80ab-9d6b7fcdcb2e', 3, 'me', false),
  ('825f5bc6-1e64-5beb-b20e-774dc8940d88', '8116f9e8-eff2-542c-85d7-83dbc14b25b2', 1, 'Obrigado! Até logo.', false),
  ('2fea776e-5e4f-5e02-8dd3-4c5a278b3dd6', '8116f9e8-eff2-542c-85d7-83dbc14b25b2', 2, 'Agradeço a informação. Fico a aguardar a vossa resposta até sexta-feira.', true),
  ('b9ef8b7c-4229-5b8f-a5d2-f23e00e158eb', '8116f9e8-eff2-542c-85d7-83dbc14b25b2', 3, 'Está bem, diga-me quando souber.', false),
  ('e933aec9-c4cb-5ea7-8ed0-962cb75fb202', '95e50b4e-bd8e-5dd7-ae49-8136425f7514', 1, 'Beijinhos,', false),
  ('3249d56e-8a1e-56fc-8e0c-63d7362c3549', '95e50b4e-bd8e-5dd7-ae49-8136425f7514', 2, 'Com os melhores cumprimentos,', true),
  ('75be92cd-1046-5b24-bcf7-8a17c21e6d15', '95e50b4e-bd8e-5dd7-ae49-8136425f7514', 3, 'Até já,', false),
  ('bf6b2e99-62db-5d50-9557-6356402112b1', '2569aa45-a3ff-5115-afcb-9a6a5975461b', 1, 'anexo', true),
  ('09c1f9be-4d01-5737-917f-bea2cea8ea53', '2569aa45-a3ff-5115-afcb-9a6a5975461b', 2, 'anexado', false),
  ('54c51011-3f43-5746-83ca-00028fb5e305', '2569aa45-a3ff-5115-afcb-9a6a5975461b', 3, 'anexar', false),
  ('cb2c23cd-a732-572e-802d-003f984b1144', '88dbff2c-7c64-5cd9-91fd-4d0d603ee22f', 1, 'Isso está errado.', false),
  ('2e4da38f-c42c-5ae4-96de-784e64e7a8ca', '88dbff2c-7c64-5cd9-91fd-4d0d603ee22f', 2, 'Vejo as coisas de outra forma — posso propor outra abordagem?', true),
  ('0218d24c-7e8f-5d17-8d4e-55b958b832e6', '88dbff2c-7c64-5cd9-91fd-4d0d603ee22f', 3, 'O senhor não percebe o problema.', false),
  ('d0594168-92d8-5a38-a336-99df528f66c1', '168cc302-3108-5e20-907d-9f791ce66490', 1, 'Deixe-me só terminar esta ideia e depois ouço-o com atenção.', true),
  ('55a0baa8-bb7a-5b38-9213-5eb72b234fdc', '168cc302-3108-5e20-907d-9f791ce66490', 2, 'Não me interrompa.', false),
  ('d21cb5b1-891a-57fd-90c9-ade325dc7f28', '168cc302-3108-5e20-907d-9f791ce66490', 3, 'Nada, deixe estar, continue.', false),
  ('b27e32e9-db53-5380-a5a3-5d619bee8e91', 'af576c2b-bdee-5706-8861-88aa4e48d4db', 1, 'Adiante, o que falta na agenda?', false),
  ('771ab78b-ce75-5c2e-814f-b245823cc989', 'af576c2b-bdee-5706-8861-88aa4e48d4db', 2, 'Podemos registar este ponto e retomá-lo quinta-feira com os números?', true),
  ('54646ece-0f84-53c8-9e02-15d11427e3e5', 'af576c2b-bdee-5706-8861-88aa4e48d4db', 3, 'Já falámos disto tempo demais.', false),
  ('e646de9c-5a56-554b-a657-2e7280edd456', 'b1df04b6-3fa0-5ed6-9ec0-8fefc4a333d6', 1, 'Olá a todos, chamo-me Thabo e hoje vou falar sobre várias coisas.', false),
  ('b110204a-4ba4-5cb4-971c-3b42c3f9c38f', 'b1df04b6-3fa0-5ed6-9ec0-8fefc4a333d6', 2, 'Em cinco minutos vou mostrar porque é que os prazos escorregaram e como resolver.', true),
  ('a7f54fdb-8179-5058-b380-cf2c0c6d99df', 'b1df04b6-3fa0-5ed6-9ec0-8fefc4a333d6', 3, 'Muito obrigado por terem vindo, agradeço o vosso tempo.', false),
  ('2f8b2dde-c8fe-5e2e-ab87-6fa62db88f1f', '3955b117-2b8b-5236-a73a-43b26cabb0a0', 1, 'E pronto, também…', false),
  ('1d8b29ad-11c5-5a48-b09a-2c6bc4446661', '3955b117-2b8b-5236-a73a-43b26cabb0a0', 2, 'Ficámos pelos custos. Passemos agora ao pessoal.', true),
  ('6b8c7ca9-ecdb-5fa1-a45d-a94863388620', '3955b117-2b8b-5236-a73a-43b26cabb0a0', 3, 'Próximo diapositivo.', false),
  ('4852ffba-7530-5f7f-bb90-cbf255486eee', '3afe4bb4-1f52-55d1-b327-857150b0e60f', 1, 'Não tenho esse número comigo, envio-lho na quinta-feira.', true),
  ('1031c856-d5e9-5f81-b2b6-97f7c3a2b854', '3afe4bb4-1f52-55d1-b327-857150b0e60f', 2, 'Penso que ronda os vinte por cento…', false),
  ('7506f7cf-b9d1-5bc4-a552-1ff54c93b3f0', '3afe4bb4-1f52-55d1-b327-857150b0e60f', 3, 'Isso não é do meu departamento.', false),
  ('e65adcab-24f4-5ba5-b8a6-67052669e507', 'b01fff81-a94b-510b-a8cf-aafd48bed116', 1, 'Is a colleague already helping you?', true),
  ('e042ebaf-1d30-5841-831b-31c97e84edc4', 'b01fff81-a94b-510b-a8cf-aafd48bed116', 2, 'Do you need directions?', false),
  ('af16f144-4f9c-5990-a440-6124b23dfb2d', 'b01fff81-a94b-510b-a8cf-aafd48bed116', 3, 'Would you like a bag?', false),
  ('e396b96b-b76d-56ae-bf3d-84f659696d1b', '25a5d066-bea5-5d0c-ba48-6a9922a9cefb', 1, 'Eu estou bem, obrigado, e você?', false),
  ('04a8bdba-88b6-5b8c-a07a-9121e2e79aaa', '25a5d066-bea5-5d0c-ba48-6a9922a9cefb', 2, 'Tudo, obrigado — e contigo?', true),
  ('30a70eda-74c1-5b29-bfc5-5d3635e0f750', '25a5d066-bea5-5d0c-ba48-6a9922a9cefb', 3, 'Está a correr bem na minha vida.', false),
  ('c851389a-62e1-5edf-b985-32814b6f1a5b', '49f15ab8-4f95-50e5-b974-d4f7febc28b6', 1, 'Repita.', false),
  ('a11424e0-ddc1-5e6b-b61d-91612e036173', '49f15ab8-4f95-50e5-b974-d4f7febc28b6', 2, 'Desculpe, pode repetir se faz favor?', true),
  ('a573d0f5-6c89-5f58-966c-5a1b8b4915ce', '49f15ab8-4f95-50e5-b974-d4f7febc28b6', 3, 'O que disse você?', false),
  ('892e62b5-a80f-565c-b95b-e34596c5bc0f', '750db954-b6f1-5feb-8e32-649afd2a61b9', 1, '10:30', true),
  ('b9dfe398-e5fd-57b4-974f-4b39d4168da5', '750db954-b6f1-5feb-8e32-649afd2a61b9', 2, '10:00', false),
  ('42ca15b6-6b1f-5d2b-8637-e19820ac2428', '750db954-b6f1-5feb-8e32-649afd2a61b9', 3, '9:30', false),
  ('b5c97d21-619a-5815-9041-99e25f5aa4f7', '332c17da-5774-551c-836b-0b2fdee61e3d', 1, 'Podemos passar a reunião de terça para quarta, à mesma hora?', true),
  ('ee2afd4b-323b-5576-8d83-8b69dbaf59cd', '332c17da-5774-551c-836b-0b2fdee61e3d', 2, 'Terça-feira é complicado para mim.', false),
  ('f262847f-595d-557a-84a4-dd3ade75b86a', '332c17da-5774-551c-836b-0b2fdee61e3d', 3, 'Não sei se consigo na terça, logo se vê.', false),
  ('5104e973-b9f6-5d9c-82b5-724d81723ee1', '23899ebe-68b9-5e10-9645-cfe94aeabec1', 1, 'Boa, até lá!', false),
  ('8bdedb87-8706-5de1-9dbe-a1f9a3f20b7f', '23899ebe-68b9-5e10-9645-cfe94aeabec1', 2, 'Fica confirmado: quarta-feira, 14 de agosto, 10:30, no seu escritório.', true),
  ('5842cc82-9cf2-5a86-a59b-6d5da9f63bb3', '23899ebe-68b9-5e10-9645-cfe94aeabec1', 3, 'Está bem, combinado.', false)
on conflict (id) do nothing;

insert into placement_questions (id, course_id, skill, tag, context, prompt, sort_order) values
  ('7a30688b-da9e-5130-97cc-583f73e869f8', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'Grammar', 'Correção', NULL, 'Complete: « ___ em Lisboa há três anos. »', 1),
  ('6cab9892-b439-5be1-91ae-080d60dafdbf', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'Vocabulary', 'Escolha de palavra', NULL, 'Complete: « Temos de finalizar o ___ antes de sexta-feira. »', 2),
  ('d77f3bb0-f7e3-5547-a9fa-ef1c27ff0b3f', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'Reading', 'Compreensão', '« O prazo foi antecipado para quinta-feira. Agradecemos que envie a sua parte até ao final do dia de quarta-feira para podermos rever em conjunto. »', 'What does the writer want you to do?', 3),
  ('75340924-0c01-5707-8106-9d88bd656c67', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'Writing', 'Registo', NULL, 'You are emailing a manager you have never met. Which opening fits best?', 4),
  ('c8b2b821-624a-5ca0-a539-f988bfb70ccd', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'Listening', 'Pormenor', 'Ouve: « A reunião mudou para a sala 2, começamos às nove e um quarto. »', 'When and where does the meeting start?', 5),
  ('355d286d-44f4-5bf3-839c-997b2eb7344d', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'Speaking', 'Resposta', NULL, 'A colleague asks you to take the minutes, but you are presenting. What is the best reply?', 6)
on conflict (id) do nothing;

insert into placement_options (id, question_id, sort_order, body, points) values
  ('c762ead5-353b-5993-a84a-0380ff8cbc1c', '7a30688b-da9e-5130-97cc-583f73e869f8', 1, 'Vivi', 1),
  ('b26fa54a-4670-5f8d-92ae-a96b0967fe8e', '7a30688b-da9e-5130-97cc-583f73e869f8', 2, 'Vivo', 2),
  ('e6daff07-4b8e-54fd-9119-e343e3949912', '7a30688b-da9e-5130-97cc-583f73e869f8', 3, 'Vivia', 0),
  ('3c9019bb-8dd6-5c45-a379-3b9a134d7406', '6cab9892-b439-5be1-91ae-080d60dafdbf', 1, 'contrato', 2),
  ('f890b3cc-e8d7-54d2-857e-c812f25107cd', '6cab9892-b439-5be1-91ae-080d60dafdbf', 2, 'contacto', 0),
  ('b7ccfa1e-3e5c-51c0-b0f3-991124bf8db0', '6cab9892-b439-5be1-91ae-080d60dafdbf', 3, 'contraste', 1),
  ('7a3b2226-e0a0-5b63-8e5e-859caafedcb3', 'd77f3bb0-f7e3-5547-a9fa-ef1c27ff0b3f', 1, 'Enviar a sua parte até quarta-feira à noite.', 2),
  ('47337f02-d8b7-59ed-9a9d-97c8c9306b41', 'd77f3bb0-f7e3-5547-a9fa-ef1c27ff0b3f', 2, 'Rever todo o documento na quinta-feira.', 1),
  ('3bc445e2-448b-5b54-9887-100d68e523e6', 'd77f3bb0-f7e3-5547-a9fa-ef1c27ff0b3f', 3, 'Esperar pela confirmação do prazo.', 0),
  ('a3979995-5699-5c20-8d57-eeca92dada9d', '75340924-0c01-5707-8106-9d88bd656c67', 1, 'Olá! Uma coisa rápida.', 0),
  ('c073c131-28d8-5cac-8ca4-cd3b2f42ea9d', '75340924-0c01-5707-8106-9d88bd656c67', 2, 'Exma. Senhora Dra. Dlamini, espero que esteja tudo bem.', 2),
  ('fbb91a0f-c63e-59a9-846f-d4ac80e2fc33', '75340924-0c01-5707-8106-9d88bd656c67', 3, 'Bom dia. Escrevo-lhe a respeito da vaga aberta.', 1),
  ('9f7c599b-1de1-5e6c-97e8-9fe62c1fc9ae', 'c8b2b821-624a-5ca0-a539-f988bfb70ccd', 1, '9:15, sala 2', 2),
  ('f13ff6ed-55a9-53a4-9b59-0d04447375e4', 'c8b2b821-624a-5ca0-a539-f988bfb70ccd', 2, '9:00, sala 2', 1),
  ('29a59d38-2787-5eaa-a743-e4dd42e54f8d', 'c8b2b821-624a-5ca0-a539-f988bfb70ccd', 3, '9:15, sala 1', 0),
  ('f575613e-dbfb-515d-b6e4-e41d8b9250f6', '355d286d-44f4-5bf3-839c-997b2eb7344d', 1, 'Não, não posso. Estou ocupado.', 0),
  ('ab078df5-8195-5418-b281-d09b25bf62c4', '355d286d-44f4-5bf3-839c-997b2eb7344d', 2, 'Hoje sou eu a apresentar, não vou conseguir — a Lucia poderia tratar disso?', 2),
  ('37860eb9-6dee-5088-9360-7feb971e4f0c', '355d286d-44f4-5bf3-839c-997b2eb7344d', 3, 'Talvez. Vamos ver como corre.', 1)
on conflict (id) do nothing;

insert into vocabulary (id, course_id, word, part_of_speech, definition, example, sort_order) values
  ('bf2ee3bb-63a6-537d-9a54-b8095632b911', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'negociar', 'verbo', 'Discutir algo de modo a chegar a um acordo.', 'Negociámos uma tarifa melhor com o fornecedor.', 1),
  ('e50a3002-2f62-5c10-8e0d-0b302a253361', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'implementar', 'verbo', 'Pôr em prática um plano ou uma decisão.', 'A equipa vai implementar o novo horário a partir de segunda-feira.', 2),
  ('9e8371f2-a1cf-5661-bb76-280ccf865c20', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'dinamizar', 'verbo', 'Conduzir e animar uma sessão ou reunião.', 'A Grace vai dinamizar a formação na quinta-feira de manhã.', 3),
  ('a67a868b-9562-5bfb-990e-027791e3358c', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'fazer o ponto da situação', 'locução verbal', 'Analisar em que estado está um assunto.', 'Vamos fazer o ponto da situação antes da reunião.', 4),
  ('a084436d-defe-5d29-a6bc-e6bf29fb30b1', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'a fatura', 'nome feminino', 'Documento que indica o montante devido por bens ou serviços.', 'A fatura vence trinta dias após a entrega.', 5),
  ('a876d858-cbd6-5882-ab0b-de8424f84e69', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'o prazo', 'nome masculino', 'Data limite para concluir uma tarefa.', 'O prazo foi antecipado, por isso entregámos na quarta-feira.', 6),
  ('498ce942-e359-53d0-a90b-e019922728ae', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'delegar', 'verbo', 'Atribuir uma tarefa ou responsabilidade a outra pessoa.', 'Como supervisora, delega a contagem de stock à equipa da loja.', 7),
  ('8b5d53da-0271-5ad2-ad52-0225c2792f00', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'dar seguimento', 'locução verbal', 'Voltar a contactar alguém sobre um assunto pendente.', 'Vou dar seguimento com os Recursos Humanos se não souber nada até sexta.', 8)
on conflict (id) do nothing;

insert into practice_modules (id, course_id, slug, name, icon, description, tone, target_screen, sort_order) values
  ('fa711488-4928-5d34-8b20-e658c3228ad1', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'pt-sp', 'Oralidade', 'mic', 'Conversas profissionais simuladas e treino de pronúncia.', 'terra', 'tutor', 1),
  ('047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'pt-wr', 'Escrita', 'doc', 'Mensagens, relatórios e estruturação de argumentos.', 'ochre', 'path', 2),
  ('16a5db6f-5f19-593e-9687-73b13306ac8e', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'pt-li', 'Compreensão oral', 'head', 'Reuniões, anúncios e conversa informal.', 'green', 'path', 3),
  ('0504057c-3783-594a-b247-dc00d5fa19be', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'pt-re', 'Leitura', 'book', 'Artigos, comunicados e documentos oficiais.', 'quiet', 'path', 4)
on conflict (id) do nothing;

insert into practice_exercises (id, practice_module_id, title, sort_order) values
  ('968df9eb-dff8-5f64-bfdd-db28d1dca537', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 1', 1),
  ('83c8b8e1-85d5-5903-bf92-f6a74467dc0b', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 2', 2),
  ('7dd6eb31-05ef-51b5-9149-5a97848e602b', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 3', 3),
  ('6125eb2b-4a49-53b4-bad2-fc5b5336f954', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 4', 4),
  ('ec119d87-12a9-58ba-b120-dc69b90a14ae', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 5', 5),
  ('30cf40ba-240c-54a0-8b26-323246c5b23d', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 6', 6),
  ('c117e7c6-fea2-51b8-8b9c-a748525c6001', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 7', 7),
  ('5732755b-0882-557c-8901-73836056c9bd', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 8', 8),
  ('8dfe592f-3864-59b3-b60b-b856089a325b', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 9', 9),
  ('1a2a1178-4094-5911-ba03-f61794d7b4b5', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 10', 10),
  ('6bd569ad-e53e-5b90-916b-a2a1e838c4aa', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 11', 11),
  ('e1deeb76-56d4-5c45-99c9-b63f03971b4a', 'fa711488-4928-5d34-8b20-e658c3228ad1', 'Oralidade — exercice 12', 12),
  ('698e0a0b-f52e-5425-87bd-b2d411efbc44', '047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'Escrita — exercice 1', 1),
  ('5f0b6949-a247-5e18-9c8e-22da188bf84c', '047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'Escrita — exercice 2', 2),
  ('7817865b-d620-5c3a-88bd-b2a0e4c5031f', '047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'Escrita — exercice 3', 3),
  ('b22aef15-dd33-57ef-98b3-707fe50c2a95', '047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'Escrita — exercice 4', 4),
  ('2f64d19e-4430-5094-afd8-b11abc42d19d', '047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'Escrita — exercice 5', 5),
  ('32396c0f-e91a-5479-97fe-034e7ee01a80', '047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'Escrita — exercice 6', 6),
  ('2ee97ad2-8916-50aa-baf2-3bc288f45ee3', '047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'Escrita — exercice 7', 7),
  ('137e262b-90c9-5228-9469-bb17b8650908', '047e27d9-361b-5b4c-ba20-c4963fe27b0f', 'Escrita — exercice 8', 8),
  ('989b83ad-d6b6-556e-8f60-2b27040fb1dd', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 1', 1),
  ('b0358e4e-0bcb-577c-b109-ae9a92d716ea', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 2', 2),
  ('0caa26a7-2a67-5a50-8f53-843dc9a94650', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 3', 3),
  ('0ac120f6-f60c-5281-998e-44d1e94519b3', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 4', 4),
  ('78adf7e5-ef14-56eb-aced-63ed235d5d4c', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 5', 5),
  ('a22b278c-7d8c-552b-8ccb-bd064321807b', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 6', 6),
  ('fb50bc59-2241-553c-8070-bccf6c657f69', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 7', 7),
  ('d68fc2d4-717e-5e4e-b497-f577c5d936ed', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 8', 8),
  ('f9d72c42-c1e9-5517-b927-d155a7c7e4b8', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 9', 9),
  ('fa02d6fa-e4cc-5d97-8f1f-4f4d4047ecfe', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 10', 10),
  ('7ae40d09-df30-5e47-a552-bb9c37c5d956', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 11', 11),
  ('85aa6cac-f48a-5f77-b29b-73fcc8064fe7', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 12', 12),
  ('a7339353-75c8-5bbc-b43f-70e0585712d6', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 13', 13),
  ('754e9933-37bc-57c6-885e-65f72c9cfa11', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 14', 14),
  ('1c633a6f-8abd-5469-9a77-60b6d22a34dc', '16a5db6f-5f19-593e-9687-73b13306ac8e', 'Compreensão oral — exercice 15', 15),
  ('f4d20e0c-b3fc-5b8d-a8d6-ea469372646c', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 1', 1),
  ('7576db11-909c-533a-9e3d-2d3342f6eef5', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 2', 2),
  ('cce6fe42-391d-552a-894f-33d34383219f', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 3', 3),
  ('b22dc932-7638-5dae-8a99-9882c424c6f4', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 4', 4),
  ('f3b96757-2452-5762-8224-c20680a2d981', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 5', 5),
  ('265e9d0f-d94b-57b4-923d-9aaf1a320639', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 6', 6),
  ('fd909347-0607-56e9-b1b0-9d77f29bac3a', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 7', 7),
  ('cf86df53-3350-5f6c-a57f-d9d2ba4b2fd1', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 8', 8),
  ('718444af-11d9-5faf-ae92-fca76daf39b6', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 9', 9),
  ('af4487f4-c2f1-5a33-a1bf-0f660ed72a8b', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 10', 10),
  ('02eb93b9-23dc-5bc0-8671-6df3141329f2', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 11', 11),
  ('61f51cc1-d4cc-5194-a1bb-a250d15ddc1c', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 12', 12),
  ('2371f61d-2589-5e6a-888b-e7156e884e39', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 13', 13),
  ('5b59ba1b-bbe0-5bcd-9f90-6c7fedb0cef1', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 14', 14),
  ('4f7380e5-c1d7-525e-bf41-60ebab8f15ed', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 15', 15),
  ('fab91acc-89b2-5da6-be27-08ebcd5720e0', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 16', 16),
  ('928f0489-1b4e-57a9-a885-24b125dff16d', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 17', 17),
  ('62f6f0b0-2711-5f4c-83f5-b99bd7a6a70c', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 18', 18),
  ('9f7e8241-c136-52c7-95f5-4aff2970bb73', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 19', 19),
  ('a6ec77db-5ccf-5f6c-97ee-0a5180a19ec0', '0504057c-3783-594a-b247-dc00d5fa19be', 'Leitura — exercice 20', 20)
on conflict (id) do nothing;

insert into tutor_scenarios (id, course_id, slug, title, level_code, sort_order) values
  ('3a13ff73-422c-5947-baac-07a637617fc1', 'd18fb5c8-2ffe-5987-be65-c58f9be2fc90', 'pt-entrevista', 'Entrevista de emprego', 'B1', 1)
on conflict (id) do nothing;

insert into tutor_turns (id, scenario_id, sort_order, goal, prompt, follow_up) values
  ('8c73fa4a-0dba-58ce-898b-4f83d21ae496', '3a13ff73-422c-5947-baac-07a637617fc1', 1, 'Apresentar-se', 'Olá, bem-vindo a esta entrevista de treino. Vamos começar de forma simples: pode falar-me um pouco sobre si?', 'Bom começo. A estrutura está clara: nome, função, cidade, motivação. Vamos agora à experiência.'),
  ('4d8351ac-be66-5adb-9ad9-1dc136ffd1e8', '3a13ff73-422c-5947-baac-07a637617fc1', 2, 'Descrever a experiência', 'Há quanto tempo trabalha na área e que tipo de projetos desenvolve?', 'Muito bem. Os entrevistadores retêm os detalhes concretos: um cliente, um resultado, uma dimensão.'),
  ('7b6a85cb-f18e-540f-9845-ef259ca53653', '3a13ff73-422c-5947-baac-07a637617fc1', 3, 'Responder a uma pergunta difícil', 'Fale-me de um projeto que não correu como previsto. O que fez?', 'Bom fecho. Manteve o foco nas suas ações e no que mudou depois.')
on conflict (id) do nothing;

insert into tutor_replies (id, turn_id, sort_order, body, score, feedback_kind, feedback_body, fix_before, fix_after) values
  ('32d222a6-3b82-5171-9117-3f316b74cd51', '8c73fa4a-0dba-58ce-898b-4f83d21ae496', 1, 'Olá, obrigado. Chamo-me David, sou programador em Lagos e gosto de criar aplicações que ajudam as pessoas.', 3, 'good', 'Nome, função, cidade e motivação — exatamente o que um entrevistador espera ouvir.', NULL, NULL),
  ('6b1c5ccc-8f35-5c76-b9fc-6ce6136870f6', '8c73fa4a-0dba-58ce-898b-4f83d21ae496', 2, 'Eu sou trabalhar com aplicações há três anos.', 1, 'fix', NULL, 'Eu sou trabalhar com aplicações', 'Eu trabalho com aplicações'),
  ('3fb1382c-88d9-59da-b029-f133f2682992', '8c73fa4a-0dba-58ce-898b-4f83d21ae496', 3, 'Programador.', 1, 'note', 'Demasiado curto. Respostas de uma palavra são lidas como falta de confiança — acrescente uma frase de contexto.', NULL, NULL),
  ('f322f6b4-e83b-5fc0-bac1-3b829b84a034', '4d8351ac-be66-5adb-9ad9-1dc136ffd1e8', 1, 'Trabalho nesta área há cerca de três anos, sobretudo em aplicações móveis para pequenas empresas.', 3, 'good', '« Há três anos » com o presente: o tempo certo para algo que começou no passado e continua.', NULL, NULL),
  ('808651c1-c06c-5506-9710-3b59c7767c36', '4d8351ac-be66-5adb-9ad9-1dc136ffd1e8', 2, 'Desde três anos eu desenvolvo aplicações móveis.', 1, 'fix', NULL, 'Desde três anos eu desenvolvo', 'Há três anos que desenvolvo'),
  ('19e24d1b-e554-5150-8692-2238cbc7e164', '4d8351ac-be66-5adb-9ad9-1dc136ffd1e8', 3, 'Três anos. Aplicações móveis.', 2, 'note', 'Correto mas telegráfico. Acrescente um exemplo concreto.', NULL, NULL),
  ('4f31786f-5ee7-50d8-a59f-ae7a1afe7524', '7b6a85cb-f18e-540f-9845-ef259ca53653', 1, 'A nossa aplicação de entregas saiu com um erro no pagamento. Revertemos a versão, corrigi nessa noite e acrescentei um teste.', 3, 'good', 'Problema, ação, prevenção — a estrutura que os entrevistadores procuram.', NULL, NULL),
  ('4799baa1-87d2-5265-ab14-f95cfe76dfbe', '7b6a85cb-f18e-540f-9845-ef259ca53653', 2, 'Nada corre mal nos meus projetos, sou muito cuidadoso.', 0, 'note', 'Soa defensivo. A pergunta serve para perceber como reage, não se é perfeito.', NULL, NULL),
  ('f227eab3-3865-5bd8-a3bc-988ef1909534', '7b6a85cb-f18e-540f-9845-ef259ca53653', 3, 'Houve um erro e o meu chefe ficou muito zangado com a equipa.', 1, 'note', 'Mantenha o foco na sua ação e não na reação dos outros. O que fez a seguir?', NULL, NULL)
on conflict (id) do nothing;

-- Make every language selectable.
update languages set is_active = true;

