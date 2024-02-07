const express = require('express')
const chirpsStore = require('../chirpstore')
let router = express.Router()

router.get('/:id?', (req, res) =>{
    const id = parseInt(req.params.id)

    if(id) {
        if(id < 0 ) {
            return res.status(400).json({ message: "ID must be a positive number" })
        }    
        res.json(chirpsStore.GetChirp(id))
    } else {
        const chirps = chirpsStore.GetChirps()
        delete chirps.nextid

        const updatedChirps = Object.keys(chirps).map(id =>{
            const chirp = chirps[id]
            return{...chirp, id}
        })
        res.json(updatedChirps)
    }
})

router.post('/', (req, res) =>{
    const { text, username } = req.body

    if(!text || typeof text !== "string" || text.length > 280) {
        res.status(400).json({ message: "Chirp text must be a string no more than 280 characters"})
        return
    }

    if(!username || typeof username !== "string" || username.length > 20) {
        res.status(400).json({ message: "Chirp text must be a string no more than 20 characters"})
        return
    }
    chirpsStore.CreateChirp({text, username})
    res.status(200).json({ message:"Sucessfully created chirp!" })
})

router.put('/:id?', (req, res) =>{
    const id = parseInt(req.params.id)

    if(id !== 0 && !id || id < 0 ){
        return res.status(400).json({ message: "ID must be a positive number" })
    }

    const { text, username } = req.body
    
    if(!text || typeof text !== "string" || text.length > 280) {
        res.status(400).json({ message: "Chirp text must be a string no more than 280 characters"})
        return
    }

    if(!username || typeof username !== "string" || username.length > 20) {
        res.status(400).json({ message: "Chirp text must be a string no more than 20 characters"})
        return
    }

    chirpsStore.UpdateChirp(id, { text, username })
    res.status(200).json({ message:"Sucessfully updated chirp!" })
})

router.delete('/:id?', (req, res) =>{
    const id = parseInt(req.params.id)

    if(id !== 0 && !id || id < 0 ){
        return res.status(400).json({ message: "ID must be a positive number" })
    }

    chirpsStore.DeleteChirp(id)
    res.status(200).json({ message:"Sucessfully deleted chirp!" })
})

module.exports = router