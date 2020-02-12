const express = require('express')
const router = express.Router()
const Coaster = require('../models/coaster.model')
const Park = require('../models/park.model')

// Aquí los endpoints

router.get('/', (req, res) => {
    Coaster.find()
        .populate('park')
        .then(allCoasters => res.render('coasters/coasters-index', { coasters: allCoasters }))
        .catch(err => console.log('Error consultando las montañas rusas en la BBDD: ', err))
})

router.get('/new', (req, res) => {
    Park.find()
        .then(allParks => res.render('coasters/new-coaster', { parks: allParks }))
        .catch(err => console.log('Error consultando los parques en la BBDD: ', err))
})
router.post('/new', (req, res) => {

    const { name, description, inversions, length, park } = req.body

    Coaster.create({ name, description, inversions, length, park })
        .then(() => {
            res.redirect('/parks')
            console.log(req.body)
        })
        .catch(err => {
            res.redirect('new')
            console.log('Error incluyendo la entrada en la BBDD: ', err)
        })
})

router.get('/coaster-details/:id', (req, res) => {
    const coasterId = req.params.id
    Coaster.findById(coasterId)
        .populate('park')
        .then(theCoaster => res.render('coasters/coaster-details', theCoaster))
        .catch(err => console.log('Error consultando las montañas rusas en la BBDD: ', err))
})

router.get('/delete/:id', (req, res, next) => {
    const coasterId = req.params.id;
    Coaster.findByIdAndRemove(coasterId)
        .then(x => res.redirect('/coasters'))
        .catch(err => console.log(err))
});

// Editar coaster
router.get('/edit/:coasterId', (req, res) => {
    const coasterId = req.params.coasterId

    Coaster.findById(coasterId)
        .then(theCoaster => {
            let coaster = theCoaster
            Park.find()
                .then(allParks => res.render({ parks: allParks, coaster }))
                .catch(err => console.log('Error consultando los parques en la BBDD: ', err))
        })
        .catch(err => console.log(err))
})
// router.post('/edit/:coasterId', (req, res) => {
//     const coasterId = req.params.coasterId

//     // Retorna el objeto actualizado:
//     Coaster.findByIdAndUpdate(coasterId, req.body)
//         .then(x => res.redirect(`/coaster/coaster-details/${coasterId}`))
//         .catch(err => console.log(err))
// })


module.exports = router