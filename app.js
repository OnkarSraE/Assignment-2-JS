let prompt = document.getElementById('prompt')
let chatContainer = document.getElementById('chatcontainer')
const API_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBTeeyTsudcGO1GR2ZtopGt9Ysc-PiBiMs"
let imageBtn = document.getElementById('image')
let imageInput= document.querySelector("#image input")
let submitBtn= document.getElementById('submit')

let user={
    message: null,
    file:{
        mime_type:null,
        data: null
    }
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area")
    let requestOption = {
        method:"POST",
        Headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({"contents":[
            {"parts":[{"text":user.message},(user.file.data?[{"inline_data": user.file}]:[])

            ]
        }]
     })
    }
    try{
        let response = await fetch(API_url, requestOption)
        let data = await response.json()
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        console.log(apiResponse);
        text.innerHTML = apiResponse
        
    }catch(error){
        console.log(error);
        
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})
        user.file={}
    }
    
}

function createChatBox(html, classes){
    let div = document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}

function handlechatResponse(message){
    user.message = message
    let html = `<img src="user.png" alt="user image" id="userImage" width="50">
    <div class="user-chat-area">
        ${user.message}
        ${user.file.data?`<img src ="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
    </div>`
    prompt.value=""
let userChatBox = createChatBox(html, "user-chat-box")
chatContainer.appendChild(userChatBox)
chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})

setTimeout(()=>{
    let html= `<img src="robot.png" alt="ai image" id="aiImage" width="70">
    </div>
    <div class="ai-chat-area">
    <img src="03-42-22-68_512.webp" class="load" width="50px">
    </div>`
    let aiChatBox=createChatBox(html, "ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)
},600)
}


prompt.addEventListener("keydown",(e)=>{
    if(e.key=='Enter'){
        handlechatResponse(prompt.value)

    }
})

submitBtn.addEventListener("click", ()=>{
    handlechatResponse(prompt.value)
})

imageInput.addEventListener("change", ()=> {
    const file = imageInput.files[0]
    if(!file) return

    let reader = new FileReader()
    reader.onload=(e)=>{
        let base64string = e.target.result.split(",")[1]
        user.file= {
            mime_type: file.type,
            data: base64string
        }
    }
    reader.readAsDataURL(file)
})

imageBtn.addEventListener("click", ()=>{
    imageBtn.querySelector("input").click()
})