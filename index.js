const express = require('express')
const app = express()
//raakadata
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1"
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2"
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3"
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4"
  }
]
//määrittelee bodyn arvon olemaan json.
app.use(express.json())
//get-komento, request sisältää http-pyynnön tiedot ja response määrittää, miten vastataan. eli "etusivulle" hello world.
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
//persons-lehdelle json muotoon persons.
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
//id-kentän generointi omassa funktiossa. otetaan jonon isoin arvo (jos lista ei ole tyhjä) ja lisätään +1 id:hen.
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return maxId + 1
}
//post-pyyntö
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const nameExists = persons.some(person => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})
//3.3 haku id:n pohjalta.käytetty 404-statusta jos ei löydy
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => Number(person.id) === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//tehdään info-sivu sekä sinne tarvittavat tiedot
app.get('/info', (request, response) => {
    const currentTime = new Date();
    const totalPersons = persons.length;
  
    response.send(`
      <div>
        <p>Phonebook has info for ${totalPersons} people</p>
        <p>${currentTime}</p>
      </div>
    `);
  });
//3.4. delete pyyntö. käytetty 204-statusta kun henkilöä ei enää löydy
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => Number(person.id) !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
