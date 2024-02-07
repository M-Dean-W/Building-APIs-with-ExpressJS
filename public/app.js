const usernameInput = $('#username-text')
const chirpInput = $('#chirp-text')
const chirpPanel = $('#chirps')
const chirpButton = $('#chirp-it')
const editButton = $('#edit-it')

chirpButton.on("click", createChirp)
editButton.on('click', editChirp)

let edit_id=null
getChirps()
editButton.hide()

async function getChirps () {
    const res = await fetch('/api/chirps')
    const data = await res.json()

    chirpPanel.empty()

    data.reverse().forEach((chirp) => {
        const deleteButton = $('<button class="btn btn-danger">X</button>')
        deleteButton.on("click", async function (){
            const res = await fetch('/api/chirps/'+chirp.id, { method:"DELETE" })
            const data = await res.json()
            if(res.ok){
               getChirps() 
            }else{
                alert(data.message)
            }
        })

        const editChirp = $('<button class="btn btn-info">Edit</button>')
        editChirp.on("click", async function (){
           edit_id=chirp.id
           editButton.show()
           chirpButton.hide()
           chirpInput.val(chirp.text)
           usernameInput.val(chirp.username)
        })

        const card = $(` <div class="col-12 col-md-8">
        <div class="card shadow-lg p-2 my-2">
          <div class="card-title">
            @${chirp.username}
          </div>
          <div class="card-body">
            <p>${chirp.text}</p>
            <div class="card-footer" id="button-panel-${chirp.id}"></div>
          </div>
        </div>
      </div>`)

        chirpPanel.append(card)
        $(`#button-panel-${chirp.id}`).append(deleteButton)
        $(`#button-panel-${chirp.id}`).append(editChirp)
    });
}

async function createChirp(e) {
    e.preventDefault()

    const text = chirpInput.val()
    const username = usernameInput.val()

    if(!text || !username) return;
    
    const res = await fetch('/api/chirps', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({ text,username })
    })
    const data = await res.json()

    if (res.ok) {
        getChirps()
        chirpInput.val('')
        usernameInput.val('')
    }else{
        alert(data.message)
    }
}

async function editChirp(e) {
    e.preventDefault()

    const text = chirpInput.val()
    const username = usernameInput.val()

    if(!text || !username || !edit_id) return;

    const res= await fetch(`/api/chirps/${edit_id}`, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({ text,username })
    })
    const data =await res.json()
    if(res.ok){
        getChirps()
        edit_id=null
        editButton.hide()
        chirpButton.show()
        chirpInput.val('')
        usernameInput.val('')
    }else{
        alert(data.message)
    }
}