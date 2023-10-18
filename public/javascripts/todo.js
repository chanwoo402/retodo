const todoList = document.getElementById("todo-list");
fetch('http://localhost:3000/users', {
    method: "GET"
}).then((data) => data.json()).then((result) => {
    
    for(let i = 0; i < Object.keys(result.result).length; i++){

        const listItem = document.createElement("li");
        listItem.innerHTML = `
        <span class="task-text">${result.result[0].content}</span>
        <input type="checkbox" class="edit-checkbox">                
            <img src="images/pen.png" width="20px" height="20px" class="edit-icon">
            <img src="images/trashcan.png" width="20px" height="20px" class="delete-button">
            `;
        todoList.appendChild(listItem);
    }
})

document.addEventListener("DOMContentLoaded", function () {
    const newTaskInput = document.getElementById("new-task");
    const addButton = document.getElementById("add-button");
    const switchButton = document.getElementById("onoff-switch1");
    const switchText = document.getElementById("switchText");
    const mtContainer = document.getElementById("mtContainer");
    const fullContainer = document.getElementById("fullContainer");



    fetch('http://localhost:3000/users', {
        method: "GET",
    }).then((data) => { return data.json() }).then((data) => {
        reload()
    })


    addButton.addEventListener("click", function () {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span class="task-text">${taskText}</span>
                <input type="checkbox" class="edit-checkbox">                
                <img src="images/pen.png" width="20px" height="20px" class="edit-icon">
                <img src="images/trashcan.png" width="20px" height="20px" class="delete-button">
            `;
            todoList.appendChild(listItem);
            // newTaskInput.value = "";
            console.log(newTaskInput.value)
            fetch('http://localhost:3000/users/content', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "content": newTaskInput.value
                }
                )
            });

            // 할 일 목록이 비어있는지 확인하고 컨테이너를 업데이트
            updateContainersDisplay();
        }
    });

    // 함수: li 요소의 개수에 따라 컨테이너 표시 여부 조절
    function updateContainersDisplay() {
        const liItems = todoList.querySelectorAll("li");

        if (liItems.length === 0) {
            mtContainer.style.display = "block";
            fullContainer.style.display = "none";
        } else {
            mtContainer.style.display = "none";
            fullContainer.style.display = "block";
        }
    }

    switchButton.addEventListener("change", function () {
        if (switchButton.checked) {
            // 이전에 완료한 항목을 끝으로 이동
            const completedItems = Array.from(todoList.querySelectorAll("li.completed"));
            completedItems.forEach((item) => {
                todoList.appendChild(item);
            });
            switchText.textContent = "Move done items at the end?";
        } else {
            // 완료한 항목을 원래 위치로 이동
            const completedItems = Array.from(todoList.querySelectorAll("li.completed"));
            completedItems.forEach((item) => {
                todoList.insertBefore(item, todoList.firstChild);
            });
            switchText.textContent = "Move done items at the top?";
        }
    });

    todoList.addEventListener("click", function (event) {
        const target = event.target;

        if (target.classList.contains("edit-icon")) {
            // 클릭한 '펜' 아이콘을 포함한 li 요소를 찾음
            const listItem = target.closest("li");
            if (listItem) {
                // 텍스트 편집 가능하도록 속성을 변경
                const taskTextElement = listItem.querySelector(".task-text");
                taskTextElement.contentEditable = "true";
                taskTextElement.focus();
            }
        }

        if (target.classList.contains("edit-checkbox")) {
            const listItem = target.parentElement;
            listItem.classList.toggle("completed");
        }

        if (target.classList.contains("delete-button")) {
            target.parentElement.remove();

            fetch("http://localhost:3000/users/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "content": newTaskInput.value
                })
            }).then((res) => {
                return res.json()
            }).then((data) => {
                reload()
            }).catch((err) => {
                // console.error(`err : ${err}`)
            })


            // 할 일 목록이 비어있는지 확인하고 컨테이너를 업데이트
            updateContainersDisplay();
        }
    });

    // 텍스트 수정 후 엔터 키를 누르면 포커스 해제하여 수정 종료
    todoList.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const taskTextElement = event.target;
            taskTextElement.contentEditable = "false";
        }
    });

    function reload() {
        fetch('http://localhost:3000/users', {
            method: "GET"
        }).then((data) => data.json()).then((res) => {
            const result = res.result
            console.log(result)
            const len = Object.keys(result).length


            if (len === 0) {
                //리스트가 없으면 empty화면을 띄움
                mtContainer.style.display = "block";
                fullContainer.style.display = "none";
            } else {
                //리스트가 있으면 list목록을 띄움
                mtContainer.style.display = "none";
                fullContainer.style.display = "block";
            }
        })
        //페이지 로드시 텍스트 박스 지우기
        addText.value = ''
    }

    // 초기 페이지 로드 시 컨테이너 표시 여부 설정
    updateContainersDisplay();
});
