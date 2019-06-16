# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from notes.models import Note

from django.http import JsonResponse

import json
from datetime import datetime
import time

	#Notes.objects.filter(note_id = 1)

@csrf_exempt  
def sync_test(request):
	if request.method == 'POST':
		recieved_notes = json.loads(request.body)['notes']
		onwer_id = json.loads(request.body)['username']
		db_notes = Note.objects.filter(owner = onwer_id)

		response = {'needed_notes' : [], 'sync_notes' : []}

		for note in recieved_notes:
			try:
				fnote = db_notes.get(note_id = note['ID']) 
				if datetime.strptime(note['changed'], '%Y-%m-%dT%H:%M:%S.%fZ') > fnote.updated_timestamp.replace(tzinfo=None):  #Заметка из запроса новее
					print('kek')
					fnote.note_id = note['ID']
					fnote.name = note['title']
					fnote.tags = note['tags']
					fnote.text = note['text']
					fnote.author = note['author']
					fnote.created_date = note['created']
					fnote.updated_timestamp = note['changed']
					fnote.status = note['public']
					fnote.save()                             #Записываю заметку в базу
				elif datetime.strptime(note['changed'], '%Y-%m-%dT%H:%M:%S.%fZ') < fnote.updated_timestamp.replace(tzinfo=None):  #Заметка из запроса старее
					print('mem')
					sync_note = {'ID': fnote.note_id, 'title': fnote.name, 'tags': fnote.tags, 'text': fnote.text, 'author': fnote.author, 'created': fnote.created_date, 'chaged': fnote.updated_timestamp, 'public': fnote.status}
					response['sync_notes'].append(sync_note)  #Отправляю эту заметку
			except:
				response['needed_notes'].append(note['ID'])  #Заметка не нашлась, запрашиваю ее

		for note in db_notes:
			flag = False
			for rnote in recieved_notes:
				if rnote['ID'] == note.note_id:
					flag = True 
			if not flag:
				print(note.note_id)
				sync_note = {'ID': note.note_id, 'title': note.name, 'tags': note.tags, 'text': note.text, 'author': note.author, 'created': note.created_date, 'chaged': note.updated_timestamp, 'public': note.status}
				response['sync_notes'].append(sync_note)

	return JsonResponse(response)

@csrf_exempt 
def add_note(request):
	problems = False
	if request.method == 'POST':
		owner = json.loads(request.body)['username']
		json_data = json.loads(request.body)['notes']
		for note in json_data:
			try:
				id = Note.objects.all().last().id + 1
			except:
				id = 1
			try:
				new_note = Note.objects.create(id = id, note_id=note['ID'], owner=owner, name=note['title'], tags=note['tags'], text=note['text'], author=note['author'], created_date=note['created'], updated_timestamp=note['changed'], status=note['public'])
				new_note.save
			except:
				problems = True
	if problems:
		return JsonResponse({'success': False})
	else:
		return JsonResponse({'success': True})

@csrf_exempt 
def get_public(request):
	public_notes = Note.objects.filter(status=True)
	notes = {'public_notes': []}
	for note in public_notes:
		returned_note = {'ID': note.note_id, 'title': note.name, 'tags': note.tags, 'text': note.text, 'author': note.author, 'created': note.created_date, 'chaged': note.updated_timestamp, 'public': note.status}
		notes['public_notes'].append(returned_note)
	return JsonResponse(notes)


@csrf_exempt 
def delete(request):
	json_data = json.loads(request.body)
	try:
		Note.objects.get(note_id=json_data['ID'], owner=json_data['username']).delete()
	except:
		return JsonResponse({'success':False})
	return JsonResponse({'success':True})














