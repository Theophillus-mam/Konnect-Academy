-- Konnect Academy seed data
-- Generated from the original src/data/*.js content files.
-- Safe to re-run: every insert is keyed on a deterministic UUID.

-- Languages -------------------------------------------------------------
insert into languages (id, code, name, is_active, sort_order) values
  ('c2ba12a1-c2a5-5445-8ad5-ad5386eda903', 'en', 'English', true, 1),
  ('b9a9feec-0418-5362-a354-29f4898434b1', 'fr', 'French', false, 2),
  ('e0c8bd54-e891-570d-bf2e-a95ebde9bc11', 'pt', 'Portuguese', false, 3)
on conflict (id) do nothing;

-- CEFR levels -----------------------------------------------------------
insert into cefr_levels (code, name, min_points, sort_order) values
  ('A2', 'Elementary', 0, 1),
  ('B1', 'Intermediate', 5, 2),
  ('B2', 'Upper Intermediate', 9, 3),
  ('C1', 'Advanced', 12, 4)
on conflict (code) do nothing;

-- Course ----------------------------------------------------------------
insert into courses (id, language_id, code, title, description, sort_order) values
  ('0e697331-de5e-5e37-a40a-cc13708e7536', 'c2ba12a1-c2a5-5445-8ad5-ad5386eda903', 'workplace-english',
   'Workplace & Everyday English',
   'Practical English for professional communication and daily life.', 1)
on conflict (id) do nothing;

-- Modules ---------------------------------------------------------------
insert into modules (id, course_id, slug, title, icon, blurb, sort_order) values
  ('c32fdc6d-4819-5326-adf4-32615c9f8522', '0e697331-de5e-5e37-a40a-cc13708e7536', 'm1', 'The Workplace', 'case', 'Professional communication for offices, sites and clients.', 1),
  ('9fa967c1-c69c-562a-b56f-202ec5b8cd9e', '0e697331-de5e-5e37-a40a-cc13708e7536', 'm2', 'Community & Everyday', 'users', 'Confident English for daily life, services and neighbours.', 2)
on conflict (id) do nothing;

-- Lessons ---------------------------------------------------------------
insert into lessons (id, module_id, slug, title, tag, description, est_minutes, sort_order) values
  ('574e7196-3265-5a46-8544-6190c3f60298', 'c32fdc6d-4819-5326-adf4-32615c9f8522', 'l1', 'Complex Sentences', 'Grammar', 'Structure arguments and express nuance in professional settings.', 15, 1),
  ('8b54e88e-edf6-5875-b750-699356fde2b7', 'c32fdc6d-4819-5326-adf4-32615c9f8522', 'l2', 'Professional Emails', 'Writing', 'Draft clear, polite and effective emails for business scenarios.', 15, 2),
  ('5dea7ab4-7c20-5fa0-92cf-f37c493faedf', 'c32fdc6d-4819-5326-adf4-32615c9f8522', 'l3', 'Meeting Etiquette', 'Speaking', 'Vocabulary and phrasing for participating in and leading meetings.', 15, 3),
  ('09181e39-7e03-5985-a7ac-d36c62147e9f', 'c32fdc6d-4819-5326-adf4-32615c9f8522', 'l4', 'Workplace Presentations', 'Speaking', 'Open, signpost and close a short professional presentation.', 15, 4),
  ('2feb0773-ef19-5029-a2e0-cb7d4c86ae77', '9fa967c1-c69c-562a-b56f-202ec5b8cd9e', 'l5', 'Everyday Interactions', 'Speaking', 'Refresh conversational skills and essential intermediate grammar.', 15, 1),
  ('1bd02c2b-aa81-5826-8351-be5fe580fdd3', '9fa967c1-c69c-562a-b56f-202ec5b8cd9e', 'l6', 'Making Arrangements', 'Listening', 'Agree times, confirm plans and handle changes over the phone.', 15, 2)
on conflict (id) do nothing;

-- Lesson questions and options ------------------------------------------
insert into lesson_questions (id, lesson_id, sort_order, prompt, explanation, quote_from, quote_text, audio_url) values
  ('faaad041-ba9e-557a-9ba0-c60250c42dcd', '574e7196-3265-5a46-8544-6190c3f60298', 1, 'Join the two ideas into one professional sentence: “The delivery was late. We still met the deadline.”', '“Although” signals contrast between two clauses. The first option is a comma splice, and “so” wrongly suggests cause.', NULL, NULL, NULL),
  ('10968bb3-1504-55fb-a9ce-72a83d27eb61', '574e7196-3265-5a46-8544-6190c3f60298', 2, 'Which sentence expresses the most careful, professional tone?', 'Hedging language (“it appears”, “may have been”) softens a complaint without hiding the problem — useful with clients and suppliers.', NULL, NULL, NULL),
  ('dcb4a333-75c1-546e-ba98-54a29d00b6ae', '574e7196-3265-5a46-8544-6190c3f60298', 3, 'Complete: “___ the budget is approved, we can begin recruiting.”', '“Once” introduces a time condition. “Despite” needs a noun phrase, and “however” joins contrasting sentences, not conditions.', NULL, NULL, NULL),
  ('f59ccbde-9a0f-57e8-8305-c75cd058dc9c', '8b54e88e-edf6-5875-b750-699356fde2b7', 1, 'You recently interviewed at a logistics company in Bloemfontein. Read the message and choose the most appropriate formal reply.', 'It acknowledges the message, stays warm but formal, and repeats the timeline so both sides agree on what happens next.', 'HR Department', 'Thank you for attending the interview yesterday. We expect to make a decision by next Friday. Please let us know if you have any further questions.', 'simulated'),
  ('6f8048cd-dd9c-5d52-85f4-13848e20cb16', '8b54e88e-edf6-5875-b750-699356fde2b7', 2, 'Which subject line will get the fastest useful response?', 'A subject line should name the item and the action. The reader can prioritise it without opening the email.', NULL, NULL, NULL),
  ('2e9d24fe-ef0e-5987-acb8-787e1cf36287', '8b54e88e-edf6-5875-b750-699356fde2b7', 3, 'You need something by Tuesday. Which closing line is clearest?', 'It gives a specific deadline and an escape route, which is more likely to get an honest answer than vague urgency.', NULL, NULL, NULL),
  ('826cbc0b-e9a4-5722-bbbf-e6eb0411c428', '8b54e88e-edf6-5875-b750-699356fde2b7', 4, 'Choose the correct phrase: “Please find the report ___.”', '“Attached” is a past participle acting as an adjective — the standard collocation in business email.', NULL, NULL, NULL),
  ('e1d75cc4-c517-599d-a5d2-db1fefa70ddc', '5dea7ab4-7c20-5fa0-92cf-f37c493faedf', 1, 'You want to disagree with your manager in a meeting. Which phrasing keeps the room comfortable?', 'Naming your view as a view, then asking permission, invites discussion instead of defence.', NULL, NULL, NULL),
  ('8936a840-7d5f-5a02-931d-40e93d1c1f75', '5dea7ab4-7c20-5fa0-92cf-f37c493faedf', 2, 'Someone interrupts you mid-point. What do you say?', 'It holds your turn and hands it over deliberately — assertive without being sharp.', NULL, NULL, NULL),
  ('d5adb4b9-c7bb-5c5d-9021-de4b34768742', '5dea7ab4-7c20-5fa0-92cf-f37c493faedf', 3, 'Which phrase moves a stuck discussion forward?', '“Park it” plus a concrete next step closes the item without dismissing anyone''s point.', NULL, NULL, NULL),
  ('a75f7822-fc69-5d0c-b68c-119490e3a0ac', '09181e39-7e03-5985-a7ac-d36c62147e9f', 1, 'Which opening line orients the audience fastest?', 'It states duration, topic and payoff. The audience knows immediately why to listen.', NULL, NULL, NULL),
  ('ce768efe-23dc-53a6-9a40-b3601a0462a1', '09181e39-7e03-5985-a7ac-d36c62147e9f', 2, 'You''re moving to your second point. Which signpost is clearest?', 'Closing one idea before naming the next helps listeners follow structure without seeing your slides.', NULL, NULL, NULL),
  ('00141a2a-bde0-5e5c-8748-dec485dc1e1c', '09181e39-7e03-5985-a7ac-d36c62147e9f', 3, 'Someone asks a question you can''t answer. Best response?', 'Admitting the gap and committing to a date protects your credibility. Guessing at numbers destroys it.', NULL, NULL, NULL),
  ('6b5c7053-d8e8-59db-a125-b0028203c5b4', '2feb0773-ef19-5029-a2e0-cb7d4c86ae77', 1, 'A shop assistant asks “Are you being helped?” What does she mean?', 'It''s a fixed service phrase meaning “has a colleague already started helping you?”', NULL, NULL, NULL),
  ('8926cc6e-289b-5fb7-b839-c8f07e62b148', '2feb0773-ef19-5029-a2e0-cb7d4c86ae77', 2, 'Choose the natural reply to “How''s it going?” from a neighbour.', 'Casual greetings take short, elliptical answers. The textbook version sounds stiff between neighbours.', NULL, NULL, NULL),
  ('6b980c75-1734-5495-8612-24b126ab0772', '2feb0773-ef19-5029-a2e0-cb7d4c86ae77', 3, 'You didn''t catch what someone said. Which is most natural?', '“Sorry, could you…” is the standard polite repair phrase in everyday English.', NULL, NULL, NULL),
  ('03453575-2c0d-5f44-b95f-dd5337918af0', '1bd02c2b-aa81-5826-8351-be5fe580fdd3', 1, 'You hear: “Does half ten work for you?” What time is proposed?', 'In British-influenced English “half ten” means half past ten, not half to ten.', NULL, NULL, 'simulated'),
  ('531a030b-f526-5172-8e13-f7ef5a122714', '1bd02c2b-aa81-5826-8351-be5fe580fdd3', 2, 'You need to move a meeting. Which is clearest on the phone?', 'It names the change and offers a specific alternative, so the other person can say yes in one word.', NULL, NULL, NULL),
  ('17406749-c8ae-5452-8d10-0160f45fcbeb', '1bd02c2b-aa81-5826-8351-be5fe580fdd3', 3, 'Confirming a plan, which is most reliable?', 'Repeating date, time and place in writing prevents the most common cause of missed meetings.', NULL, NULL, NULL)
on conflict (id) do nothing;

insert into lesson_options (id, question_id, sort_order, body, is_correct) values
  ('65351e5c-55bc-576e-919a-4c78f920fdd4', 'faaad041-ba9e-557a-9ba0-c60250c42dcd', 1, 'The delivery was late, we still met the deadline.', false),
  ('1c1f5303-6633-5a44-920a-0fcd600c0f82', 'faaad041-ba9e-557a-9ba0-c60250c42dcd', 2, 'Although the delivery was late, we still met the deadline.', true),
  ('832d8e5a-c039-5124-9be0-54fd61300978', 'faaad041-ba9e-557a-9ba0-c60250c42dcd', 3, 'The delivery was late so we still met the deadline.', false),
  ('f1392878-8eea-5193-901a-42f4d26de0bf', '10968bb3-1504-55fb-a9ce-72a83d27eb61', 1, 'You sent the wrong invoice.', false),
  ('a2fc834d-c463-5e7c-bf64-94a3dd07aaf6', '10968bb3-1504-55fb-a9ce-72a83d27eb61', 2, 'It appears the invoice we received may have been issued in error.', true),
  ('f8b09946-17b0-5081-8fb0-7cb8d390b294', '10968bb3-1504-55fb-a9ce-72a83d27eb61', 3, 'The invoice is wrong, please fix it now.', false),
  ('64823ef0-3471-5849-8325-56d8515ca65c', 'dcb4a333-75c1-546e-ba98-54a29d00b6ae', 1, 'Once', true),
  ('c37337da-8a21-5b44-8414-24d3c329612c', 'dcb4a333-75c1-546e-ba98-54a29d00b6ae', 2, 'Despite', false),
  ('6116e49a-77ec-59a5-b63a-33d61f041119', 'dcb4a333-75c1-546e-ba98-54a29d00b6ae', 3, 'However', false),
  ('0651b7e4-14f3-5b72-bafa-8b3db5a6e82b', 'f59ccbde-9a0f-57e8-8305-c75cd058dc9c', 1, 'Thanks for the update! Catch you later.', false),
  ('a6827f31-c6d1-57a3-8a92-6de29d9864d5', 'f59ccbde-9a0f-57e8-8305-c75cd058dc9c', 2, 'Thank you for the update. I look forward to hearing from you next Friday.', true),
  ('f63e868e-9fce-5a06-af4b-a55ab5bad89b', 'f59ccbde-9a0f-57e8-8305-c75cd058dc9c', 3, 'Okay, tell me when you know. I really want this job.', false),
  ('69189bee-d324-5473-bb13-facf8c5bd17d', '6f8048cd-dd9c-5d52-85f4-13848e20cb16', 1, 'Question', false),
  ('91285536-e440-56fb-a499-9d53b60c541f', '6f8048cd-dd9c-5d52-85f4-13848e20cb16', 2, 'Invoice #4471 — payment date confirmation needed', true),
  ('92ffaa28-1500-5b91-917c-e6505e402374', '6f8048cd-dd9c-5d52-85f4-13848e20cb16', 3, 'Hi there, hope you''re well!', false),
  ('335f0f9b-0503-5016-83a0-4fc4df8fec30', '2e9d24fe-ef0e-5987-acb8-787e1cf36287', 1, 'Let me know ASAP please.', false),
  ('5c764ad7-13e3-5667-b3ef-60077880ee18', '2e9d24fe-ef0e-5987-acb8-787e1cf36287', 2, 'Could you confirm by Tuesday, 5pm? If that''s tight, tell me what''s possible.', true),
  ('80218f05-6100-556f-a9be-ade136dc316e', '2e9d24fe-ef0e-5987-acb8-787e1cf36287', 3, 'Awaiting your urgent response at your earliest convenience.', false),
  ('3e5cfb4d-a672-57ab-bda8-1c45f6c6fb1b', '826cbc0b-e9a4-5722-bbbf-e6eb0411c428', 1, 'attached', true),
  ('e6fe8baf-ed8e-5a45-b647-7cf8cb505af3', '826cbc0b-e9a4-5722-bbbf-e6eb0411c428', 2, 'attaching', false),
  ('c265f151-a636-5994-b083-d6976063feb7', '826cbc0b-e9a4-5722-bbbf-e6eb0411c428', 3, 'in attach', false),
  ('cb7aa544-0440-5194-a61f-0bd41ae13eb9', 'e1d75cc4-c517-599d-a5d2-db1fefa70ddc', 1, 'That''s wrong.', false),
  ('2725f322-019e-5838-8ec3-0d559e6e8934', 'e1d75cc4-c517-599d-a5d2-db1fefa70ddc', 2, 'I see it differently — can I offer another angle?', true),
  ('58a49784-6366-5143-b0ea-161f0a1dd311', 'e1d75cc4-c517-599d-a5d2-db1fefa70ddc', 3, 'I don''t think you understand the problem.', false),
  ('109ef656-0478-5191-bc49-5d217b6283dc', '8936a840-7d5f-5a02-931d-40e93d1c1f75', 1, 'Let me just finish this thought, then I''d like to hear yours.', true),
  ('15959c08-8316-520c-8666-9b2d41abb7b2', '8936a840-7d5f-5a02-931d-40e93d1c1f75', 2, 'Please don''t interrupt me.', false),
  ('5605117f-bdd6-53c9-9080-44a3788b66a1', '8936a840-7d5f-5a02-931d-40e93d1c1f75', 3, 'Sorry, never mind, go ahead.', false),
  ('79f73bc9-ce70-5571-a23c-40846fe2dd58', 'd5adb4b9-c7bb-5c5d-9021-de4b34768742', 1, 'Anyway, what else is on the agenda?', false),
  ('ce275b8c-6b61-592c-a847-4a68b654565e', 'd5adb4b9-c7bb-5c5d-9021-de4b34768742', 2, 'Shall we park this and pick it up with the numbers on Thursday?', true),
  ('31ec94ab-e414-5434-89dd-f53905473a25', 'd5adb4b9-c7bb-5c5d-9021-de4b34768742', 3, 'We''ve been talking about this too long.', false),
  ('bea62e40-b947-5685-8186-6a2b0e99d4fa', 'a75f7822-fc69-5d0c-b68c-119490e3a0ac', 1, 'Hello everyone, my name is Thabo and today I will be talking to you about many things.', false),
  ('6f82cf16-8327-575c-bccf-06b1dd5ce2d4', 'a75f7822-fc69-5d0c-b68c-119490e3a0ac', 2, 'In the next five minutes I''ll show why our delivery times slipped, and what fixes it.', true),
  ('3b769925-639e-5624-b420-265ef9377868', 'a75f7822-fc69-5d0c-b68c-119490e3a0ac', 3, 'Thank you all so much for coming, I really appreciate your time today.', false),
  ('f232b555-76fc-55f6-b2e8-761d622918db', 'ce768efe-23dc-53a6-9a40-b3601a0462a1', 1, 'And yeah, also…', false),
  ('f36d74a2-e443-51dc-994b-cc29ad361599', 'ce768efe-23dc-53a6-9a40-b3601a0462a1', 2, 'That covers cost. Now, staffing.', true),
  ('b4c9c4d0-a086-54e8-a606-4a8e68c25807', 'ce768efe-23dc-53a6-9a40-b3601a0462a1', 3, 'Moving on to the next slide.', false),
  ('33b178fd-3800-5b51-b6ee-d2bc4432d782', '00141a2a-bde0-5e5c-8748-dec485dc1e1c', 1, 'I don''t have that figure with me — I''ll send it by Thursday.', true),
  ('1e7c1838-4313-5663-9657-197ba53639bb', '00141a2a-bde0-5e5c-8748-dec485dc1e1c', 2, 'I think it''s around... maybe 20 percent?', false),
  ('9a3f6697-fa25-5c6a-a743-35cc8a7a3ca7', '00141a2a-bde0-5e5c-8748-dec485dc1e1c', 3, 'That''s not really my department.', false),
  ('f7cd85bf-f6a0-5c81-9589-68a0df272488', '6b5c7053-d8e8-59db-a125-b0028203c5b4', 1, 'Is someone already assisting you?', true),
  ('e0e47eec-b69e-5a78-a6f0-0dd102ffd739', '6b5c7053-d8e8-59db-a125-b0028203c5b4', 2, 'Do you need directions?', false),
  ('4260e26d-5894-5369-bb09-29e12cf4a215', '6b5c7053-d8e8-59db-a125-b0028203c5b4', 3, 'Would you like a bag?', false),
  ('b1c8c4f1-4de5-521c-8920-cb9e27c34a2e', '8926cc6e-289b-5fb7-b839-c8f07e62b148', 1, 'I am fine, thank you, and you?', false),
  ('6d2d987f-75e8-5485-82d1-037c2a595e22', '8926cc6e-289b-5fb7-b839-c8f07e62b148', 2, 'Not bad, thanks — you?', true),
  ('174a3d32-5f4b-5258-835c-f23066925337', '8926cc6e-289b-5fb7-b839-c8f07e62b148', 3, 'It is going well in my life.', false),
  ('9d7cd9b2-583c-5678-ab64-dda92e34153d', '6b980c75-1734-5495-8612-24b126ab0772', 1, 'Repeat.', false),
  ('fc967beb-1175-5550-9b60-a3af591ff6aa', '6b980c75-1734-5495-8612-24b126ab0772', 2, 'Sorry, could you say that again?', true),
  ('c4556101-7bcc-576b-8911-ca4c68bcdd09', '6b980c75-1734-5495-8612-24b126ab0772', 3, 'What you said?', false),
  ('8c2e50b2-c0d8-592f-9e5d-f4435b486f0b', '03453575-2c0d-5f44-b95f-dd5337918af0', 1, '10:30', true),
  ('9833b47b-6929-57dc-beaf-52698876b078', '03453575-2c0d-5f44-b95f-dd5337918af0', 2, '10:00', false),
  ('0f3b3913-d21e-5ca4-a954-bd9d4a69b4ae', '03453575-2c0d-5f44-b95f-dd5337918af0', 3, '5:30', false),
  ('ddcbff9a-bbd4-5143-85a9-e07d58736a64', '531a030b-f526-5172-8e13-f7ef5a122714', 1, 'Can we push Tuesday''s meeting to Wednesday, same time?', true),
  ('82a47621-e149-5e88-b99a-a2b2a1e6d995', '531a030b-f526-5172-8e13-f7ef5a122714', 2, 'Tuesday is a problem for me unfortunately.', false),
  ('e0dd658f-6f25-58c2-9ea5-a7489eefa29c', '531a030b-f526-5172-8e13-f7ef5a122714', 3, 'I might not make Tuesday, we''ll see.', false),
  ('dad8f3e0-6102-5581-8dcd-644b19b8312b', '17406749-c8ae-5452-8d10-0160f45fcbeb', 1, 'Great, see you then!', false),
  ('6552af2b-16b5-5b77-9c9c-363f88824e2f', '17406749-c8ae-5452-8d10-0160f45fcbeb', 2, 'Confirmed: Wednesday 14 August, 10:30, your office.', true),
  ('9c84802e-cfaa-503d-aaec-4c035c1b1012', '17406749-c8ae-5452-8d10-0160f45fcbeb', 3, 'Okay cool, sorted.', false)
on conflict (id) do nothing;

-- Placement test --------------------------------------------------------
insert into placement_questions (id, course_id, skill, tag, context, prompt, sort_order) values
  ('c70e47de-487d-5cbd-bee9-20fddbead0d5', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Grammar', 'Sentence accuracy', NULL, 'Which sentence is correct?', 1),
  ('662ed9f4-dd1b-55cd-91f1-9a5e3cfc8c15', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Vocabulary', 'Word choice', NULL, 'Choose the best word: “We need to finalise the ___ before the supplier arrives.”', 2),
  ('00894938-af27-5a61-bb67-ba04f81b0a69', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Reading', 'Comprehension', '“Please note that the deadline has been moved forward to Thursday. Kindly submit your section by end of day Wednesday so we can review it together.”', 'What does the writer want you to do?', 3),
  ('44453d96-6b99-5c10-a910-2591af22f197', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Writing', 'Register', NULL, 'You are emailing a manager you have never met. Which opening fits best?', 4),
  ('627c9fc4-bf26-5e0f-84ce-de503309083f', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Listening', 'Detail', 'You hear: “The meeting has moved to the boardroom on the second floor — we start at half past nine.”', 'When and where does the meeting start?', 5),
  ('832070fc-e53c-554b-ba36-fe6895cf6783', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Speaking', 'Response', NULL, 'A colleague says: “Could you take the minutes today?” You are already presenting. What is the best reply?', 6)
on conflict (id) do nothing;

insert into placement_options (id, question_id, sort_order, body, points) values
  ('1199e55b-d6b7-5378-b68e-3a1bb38cd74c', 'c70e47de-487d-5cbd-bee9-20fddbead0d5', 1, 'She have worked at the depot since 2019.', 0),
  ('97a6d05a-b692-5499-8681-674d08bda04f', 'c70e47de-487d-5cbd-bee9-20fddbead0d5', 2, 'She has worked at the depot since 2019.', 2),
  ('5390c608-9dd0-5b16-a6d7-b80e37fa3580', 'c70e47de-487d-5cbd-bee9-20fddbead0d5', 3, 'She working at the depot since 2019.', 0),
  ('61556d6b-5327-5b59-ac49-a02f36f91865', '662ed9f4-dd1b-55cd-91f1-9a5e3cfc8c15', 1, 'contract', 2),
  ('298119cb-e159-5762-8f9a-f38d4b438bac', '662ed9f4-dd1b-55cd-91f1-9a5e3cfc8c15', 2, 'contact', 0),
  ('71d5cc8f-c29b-58b9-8d51-35a3db2610ae', '662ed9f4-dd1b-55cd-91f1-9a5e3cfc8c15', 3, 'contrast', 1),
  ('e0a66be5-a6d4-5dc5-b572-5e224c45060e', '00894938-af27-5a61-bb67-ba04f81b0a69', 1, 'Submit your section by Wednesday evening.', 2),
  ('b62e352b-d285-5cbc-ad96-c8e0094175aa', '00894938-af27-5a61-bb67-ba04f81b0a69', 2, 'Review the whole document on Thursday.', 1),
  ('acc09bf7-9222-5a8e-9fad-7f99f13cc069', '00894938-af27-5a61-bb67-ba04f81b0a69', 3, 'Wait until the deadline is confirmed.', 0),
  ('98f07731-d78a-5fde-8995-feac60fe7d0d', '44453d96-6b99-5c10-a910-2591af22f197', 1, 'Hey! Quick one for you.', 0),
  ('f56b8f0c-6b53-5617-bd6b-8c01db56cae9', '44453d96-6b99-5c10-a910-2591af22f197', 2, 'Dear Ms Dlamini, I hope this email finds you well.', 2),
  ('87399e24-bfc7-5052-abe6-f5a5c790cbaa', '44453d96-6b99-5c10-a910-2591af22f197', 3, 'Good day. I write to you regarding of the vacancy.', 1),
  ('e224aaa0-ab5e-5ae2-94fb-22df91b3548b', '627c9fc4-bf26-5e0f-84ce-de503309083f', 1, '9:30, second floor boardroom', 2),
  ('f17f79cd-e71e-550a-bd9a-c92b6a7a3bb4', '627c9fc4-bf26-5e0f-84ce-de503309083f', 2, '9:00, second floor boardroom', 1),
  ('f28eeda9-9cc9-563f-a10c-54284ea20632', '627c9fc4-bf26-5e0f-84ce-de503309083f', 3, '9:30, ground floor boardroom', 0),
  ('a689c8c0-49f5-5543-840b-378eb9a8dd61', '832070fc-e53c-554b-ba36-fe6895cf6783', 1, 'No, I can''t. I am busy.', 0),
  ('fbec8074-f49c-54e6-b6db-d7fecf00d379', '832070fc-e53c-554b-ba36-fe6895cf6783', 2, 'I''m presenting today, so I won''t manage — could Lerato take them instead?', 2),
  ('09604c28-971c-5f21-9c89-94dc699f142e', '832070fc-e53c-554b-ba36-fe6895cf6783', 3, 'Maybe. We will see how it goes.', 1)
on conflict (id) do nothing;

-- Vocabulary ------------------------------------------------------------
insert into vocabulary (id, course_id, word, part_of_speech, definition, example, sort_order) values
  ('3ac64664-e854-5684-8033-8963f60b333e', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Negotiate', 'verb', 'To discuss something so that you reach an agreement.', 'We negotiated a better rate with the supplier in Nairobi.', 1),
  ('1a9b5369-5cad-5271-a01b-cc5223ac617a', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Implement', 'verb', 'To put a plan or decision into action.', 'The team will implement the new shift schedule from Monday.', 2),
  ('eebdac20-ecef-52e9-86c0-2e71ac38c003', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Facilitate', 'verb', 'To make an action or process easier; to lead a session.', 'Grace will facilitate the workshop on Thursday morning.', 3),
  ('dde4765b-2ca6-5b05-8d68-2134555194ab', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Liaise', 'verb', 'To communicate with someone to work together effectively.', 'Please liaise with the warehouse before you confirm the delivery.', 4),
  ('cd114ebb-fa19-5052-9580-3904d881cc9e', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Invoice', 'noun', 'A document listing goods or services and the amount owed.', 'The invoice is due thirty days after delivery.', 5),
  ('7eb21ec5-23b9-5fdc-9bb3-0f476b7baa9b', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Deadline', 'noun', 'The latest time by which something must be finished.', 'The deadline moved forward, so we submitted on Wednesday.', 6),
  ('467e71b6-cfae-55f9-8289-08bbf73077cb', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Delegate', 'verb', 'To give a task or responsibility to someone else.', 'As supervisor, she delegates stock counts to the floor team.', 7),
  ('fa673455-3dc4-5ba8-8912-cc9fc8f82947', '0e697331-de5e-5e37-a40a-cc13708e7536', 'Follow up', 'phrasal verb', 'To contact someone again about something discussed earlier.', 'I''ll follow up with HR if I hear nothing by Friday.', 8)
on conflict (id) do nothing;

-- Practice modules ------------------------------------------------------
insert into practice_modules (id, course_id, slug, name, icon, description, tone, target_screen, sort_order) values
  ('7c85a14a-cc63-5d54-b436-1e481679af23', '0e697331-de5e-5e37-a40a-cc13708e7536', 'sp', 'Speaking', 'mic', 'Simulated workplace conversations and pronunciation drills.', 'terra', 'tutor', 1),
  ('51e224ed-630a-5560-ad99-e5d2d24a8a5e', '0e697331-de5e-5e37-a40a-cc13708e7536', 'wr', 'Writing', 'doc', 'Drafting emails, reports and structuring arguments.', 'ochre', 'path', 2),
  ('671a17d1-4230-5d16-9b08-43d96a103639', '0e697331-de5e-5e37-a40a-cc13708e7536', 'li', 'Listening', 'head', 'Comprehension checks for meetings, lectures and casual talk.', 'green', 'path', 3),
  ('479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', '0e697331-de5e-5e37-a40a-cc13708e7536', 're', 'Reading', 'book', 'Extracting key information from articles and policy documents.', 'quiet', 'path', 4)
on conflict (id) do nothing;

-- Exercises exist as rows so the counts on the Practice Hub are real,
-- not a hardcoded number next to each card.
insert into practice_exercises (id, practice_module_id, title, sort_order) values
  ('76ed445c-dc74-5b71-8b79-89d998b38aca', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 1', 1),
  ('66cad0de-d15d-562d-b6c3-c729885c3a3a', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 2', 2),
  ('197fc407-ef9a-5493-a628-078e17658095', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 3', 3),
  ('ff2e2847-df4a-534e-b147-df346c22f7da', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 4', 4),
  ('eb21c795-689f-5409-81b2-d665b68dfbdc', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 5', 5),
  ('cfac599a-8229-5c47-85af-b0e378b1b6ec', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 6', 6),
  ('eed1422f-3424-5263-b03d-5bc94fe56877', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 7', 7),
  ('3281f08e-9a33-5b69-861f-c2c507a7d7c6', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 8', 8),
  ('3ef90104-7a3c-5670-a9e2-64c24258cce9', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 9', 9),
  ('e562c19b-46be-5ec4-8969-fbb328ef980d', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 10', 10),
  ('a1421eb0-cd79-5567-b85a-9603c51b10d3', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 11', 11),
  ('eb02975c-3479-5b69-b333-221a9e2d4740', '7c85a14a-cc63-5d54-b436-1e481679af23', 'Speaking drill 12', 12),
  ('711fede4-33f1-5dc9-a5ae-12a76f8f4a4c', '51e224ed-630a-5560-ad99-e5d2d24a8a5e', 'Writing drill 1', 1),
  ('fbb63290-bff4-55fc-a802-98ceacb03f2b', '51e224ed-630a-5560-ad99-e5d2d24a8a5e', 'Writing drill 2', 2),
  ('98e7e52f-61e4-5c33-80b4-c723ebed2245', '51e224ed-630a-5560-ad99-e5d2d24a8a5e', 'Writing drill 3', 3),
  ('7d3618be-61aa-5110-9def-e4e85012d5df', '51e224ed-630a-5560-ad99-e5d2d24a8a5e', 'Writing drill 4', 4),
  ('719fceef-19c5-5838-83fa-b3e7a9acc2a5', '51e224ed-630a-5560-ad99-e5d2d24a8a5e', 'Writing drill 5', 5),
  ('4526de4c-5f59-527f-8e5b-8a0c2fd3da33', '51e224ed-630a-5560-ad99-e5d2d24a8a5e', 'Writing drill 6', 6),
  ('855572da-55d6-54c5-a84d-c19ea6d3cd16', '51e224ed-630a-5560-ad99-e5d2d24a8a5e', 'Writing drill 7', 7),
  ('ba917244-f35a-52e3-bf3e-a3b562e14efc', '51e224ed-630a-5560-ad99-e5d2d24a8a5e', 'Writing drill 8', 8),
  ('b6c65582-b5f2-5927-b340-ce01c86c9379', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 1', 1),
  ('32813310-11f3-5104-aae8-31c5df13f21e', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 2', 2),
  ('d89e194f-ba0d-5ba1-9a40-7fee61214c10', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 3', 3),
  ('c13e9f68-d08d-5e7a-b789-0cd7566df6ac', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 4', 4),
  ('6ec78d78-8ae5-5711-9cd1-e30399caa9b9', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 5', 5),
  ('c1059dba-6c67-53a0-8e7b-406aacbfa408', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 6', 6),
  ('d2c153c8-00b1-5d01-b06f-8d8f374bb775', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 7', 7),
  ('a10ecbcc-c7ee-5fa7-b0b4-e9e665b43581', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 8', 8),
  ('985e9630-414d-53f9-abd7-0eb09ee443e6', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 9', 9),
  ('b7c93fc5-78cc-5ef4-9267-44fd33f3df01', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 10', 10),
  ('6f98c57a-7410-5dec-9b02-94f22d5ff59c', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 11', 11),
  ('cc011714-7807-5a8b-a7ee-f80650af4051', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 12', 12),
  ('8fc886b4-d2f7-5dd7-af1e-ecba69253f7a', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 13', 13),
  ('bce9ad2d-5798-565d-bba0-f8f7cc8c1865', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 14', 14),
  ('fa6b90b2-b35f-518b-a275-2ee5c34b6b21', '671a17d1-4230-5d16-9b08-43d96a103639', 'Listening drill 15', 15),
  ('2c0a3d4b-f785-5ecf-ad11-9cfe36b5c92a', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 1', 1),
  ('af2f82fc-96e7-5caa-b816-30fa5cfc5242', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 2', 2),
  ('c48fb207-58c8-51ae-bbe1-c96077466c05', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 3', 3),
  ('f73ece11-0ae3-57f1-af21-643dd6917749', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 4', 4),
  ('2cdac2e8-386e-5eee-b3a9-c48c2152c7c7', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 5', 5),
  ('b3fb5e3c-4f26-5437-b4e3-d88151a5bd18', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 6', 6),
  ('39083c41-b198-559a-a038-12d7fd65f06f', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 7', 7),
  ('b5879e84-da78-50ed-bfa9-fc14d1a82821', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 8', 8),
  ('df920b5e-760b-572b-b9f8-b9dabf0282e8', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 9', 9),
  ('413df00e-dfb1-5eaf-9f23-8e6b59fb4001', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 10', 10),
  ('5aea365b-6553-5c96-a929-2cb14862fd0d', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 11', 11),
  ('3d88cdfb-6a85-5a0b-876f-b9e9657a266b', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 12', 12),
  ('eb0ef014-a607-5b7c-851b-e7cc1d3bec89', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 13', 13),
  ('ffe34ac3-9177-5ad9-bf76-d44bf64d98e8', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 14', 14),
  ('c216addb-f74a-56fd-8e56-9073518ef0da', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 15', 15),
  ('4c590339-e0fd-52f0-9cad-2a90a396df94', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 16', 16),
  ('8d0604d7-8493-55b4-979a-52c78d997c31', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 17', 17),
  ('2f64b4d8-9a74-59a9-ab1a-5252bc17ce4a', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 18', 18),
  ('ab084ac7-7d10-5977-a480-adecc09249f7', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 19', 19),
  ('59b89243-dd0c-5690-ac97-0ec1bdd5bd97', '479b5c2b-5ac3-5816-9a15-7d4a0f7b9e60', 'Reading drill 20', 20)
on conflict (id) do nothing;

-- Tutor scenario --------------------------------------------------------
insert into tutor_scenarios (id, course_id, slug, title, level_code, sort_order) values
  ('3821f93f-37f4-5ac2-9892-1b2672f615f0', '0e697331-de5e-5e37-a40a-cc13708e7536', 'interview-practice', 'Interview practice', 'B1', 1)
on conflict (id) do nothing;

insert into tutor_turns (id, scenario_id, sort_order, goal, prompt, follow_up) values
  ('88263ef5-fadf-5089-a0d0-57006f83598f', '3821f93f-37f4-5ac2-9892-1b2672f615f0', 1, 'Tell me about yourself', 'Hello! Welcome to your interview practice. Let''s start with an easy one to warm up. Could you tell me a little about yourself?', 'That''s a good start, David. Your structure is clear. Now expand a little — how long have you been developing, and what kind of applications do you build?'),
  ('ae9c70ae-aa66-5a4c-8de5-310fc98883e3', '3821f93f-37f4-5ac2-9892-1b2672f615f0', 2, 'Describe your experience', 'How long have you been developing, and what kind of applications do you build?', 'Good. Interviewers love specifics, so naming the client type helps. Let''s try a harder one.'),
  ('d720b225-ab1a-5682-8c53-0a6784907465', '3821f93f-37f4-5ac2-9892-1b2672f615f0', 3, 'Handle a difficult question', 'Tell me about a time a project did not go to plan. What did you do?', 'Strong finish. You kept the focus on your own actions and what changed afterwards.')
on conflict (id) do nothing;

insert into tutor_replies (id, turn_id, sort_order, body, score, feedback_kind, feedback_body, fix_before, fix_after) values
  ('0f333d2f-8894-5edd-b7a3-9ebd42cfcd32', '88263ef5-fadf-5089-a0d0-57006f83598f', 1, 'Hi, thank you. My name is David. I am a software developer from Lagos, and I enjoy building applications that help people.', 3, 'good', 'Clear structure: name, role, city, motivation. That''s exactly the shape an interviewer expects.', NULL, NULL),
  ('a561fce2-1eac-5206-b30c-134fb5afc3e4', '88263ef5-fadf-5089-a0d0-57006f83598f', 2, 'I am build applications for three years.', 1, 'fix', NULL, 'I am build applications', 'I have been building applications'),
  ('1c4afc1c-5ab6-5f1e-a51a-cedf2cb58b73', '88263ef5-fadf-5089-a0d0-57006f83598f', 3, 'Software developer.', 1, 'note', 'Too short — interviewers read one-word answers as low confidence. Add a sentence of context.', NULL, NULL),
  ('f79c84a2-7a7d-51c4-9e95-191e89a9606b', 'ae9c70ae-aa66-5a4c-8de5-310fc98883e3', 1, 'I''ve been developing for about three years now, mostly mobile apps for small businesses in Lagos.', 3, 'good', '“I''ve been developing” is the right tense for something that started in the past and continues now.', NULL, NULL),
  ('66ab9ad3-5758-5cc6-a3df-87bdb8efbc11', 'ae9c70ae-aa66-5a4c-8de5-310fc98883e3', 2, 'Since three years I develop mobile apps.', 1, 'fix', NULL, 'Since three years I develop', 'For three years I have been developing'),
  ('3be51727-33a3-5a83-be7d-60580049691d', 'ae9c70ae-aa66-5a4c-8de5-310fc98883e3', 3, 'Three years. Mobile apps.', 2, 'note', 'Accurate but clipped. In interviews, add one concrete example — a client, a result, a scale.', NULL, NULL),
  ('385d4961-fd0f-5963-921f-d94085e797d2', 'd720b225-ab1a-5682-8c53-0a6784907465', 1, 'Our delivery app launched with a payment bug. I rolled back the release, fixed it that night, and added a test so it couldn''t happen again.', 3, 'good', 'Problem, action, prevention — that''s the structure hiring managers are listening for.', NULL, NULL),
  ('8551d266-5e88-5e72-9f4f-40b009d1f287', 'd720b225-ab1a-5682-8c53-0a6784907465', 2, 'Nothing goes wrong in my projects, I am very careful.', 0, 'note', 'This sounds defensive. Interviewers ask this to hear how you recover, not whether you''re perfect.', NULL, NULL),
  ('ad437efb-1363-5c10-a65e-44437389eef8', 'd720b225-ab1a-5682-8c53-0a6784907465', 3, 'There was a bug and my manager was very angry with the team.', 1, 'note', 'Keep the focus on your action, not on other people''s reactions. What did you do next?', NULL, NULL)
on conflict (id) do nothing;

