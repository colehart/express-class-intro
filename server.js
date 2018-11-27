const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.locals.title = 'Pet Box';
app.locals.pets = [
  {id: 1, name: 'Hank', type: 'chinchilla'},
  {id: 2, name: 'Claracat', type: 'dog'},
  {id: 3, name: 'Craisins', type: 'cat'}
];

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.send('Oh hey Pet Box.');
});

app.get('/api/v1/pets', (request, response) => {
  const pets = app.locals.pets

  response.status(200).json(pets)
})

app.get('/api/v1/pets/:id', (request, response) => {
  const requestId = parseInt(request.params.id);
  const pet = app.locals.pets.find(pet => pet.id === requestId);

  if (!pet) return response.status(404).json({error: `pet with an id of ${requestId} was not found.`})

  response.send(pet)
})

app.post('/api/v1/pets', (request, response) => {
  const pet = request.body;
  const id = app.locals.pets[app.locals.pets.length - 1].id + 1;

  if (!pet) {
    return response.status(422).json({ error: 'No pet object provided' })
  }

  for (let requiredParameter of ["name", "type"]) {
    if (!pet[requiredParameter]) {
      return response.status(422).json({error: `Expected format: {name: <STRING>, type: <STRING>}. Missing the required parameter of ${requiredParameter}.`})
    }
  }

  app.locals.pets.push({ id, ...pet });
  return response.status(201).json({id})
})

app.put('/api/v1/pets/:id', (request, response) => {
  const newName = request.body.name;
  const id = parseInt(request.params.id);
  const pet = app.locals.pets.find(pet => pet.id === id);
  console.log(pet)
  const oldName = pet.name

  if (!pet) return response.status(404).json({ error: `pet with an id of ${id} was not found.` });
  else if (!newName) return response.status(422).json({ error: 'No pet name provided.' })

  app.locals.pets.find(pet => pet.id === id).name = newName

  response.status(202).send(`Edit successful. Pet with id of ${id} name changed from ${oldName} to ${newName}.`)
})

app.delete('/api/v1/pets/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const pet = app.locals.pets.find(pet => pet.id === id);

  if (!pet) return response.status(404).json({ error: `pet with an id of ${id} was not found.` })

  app.locals.pets = app.locals.pets.filter(pet => pet.id !== id)

  response.send(`Pet with id of ${id} successfully deleted.`)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});