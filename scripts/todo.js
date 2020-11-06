'use strict';


class Todo{
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = this.form.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todo')));
    }

    handler(){
        let timer;
        const todo = document.querySelectorAll('.todo');
        todo.forEach(btn => btn.addEventListener('click', (e) => {
            const {target} = e,
                li = target.parentNode.parentNode;

            if(target.matches('.todo-edit')) {
                const editStr = prompt('Введите изменения', li.textContent.trim());
                
                if(editStr.value === li.textContent.trim()) return;
                this.todoData.forEach(item => {
                    if(item.key === li.key) {
                        const newTodo = {
                            value: editStr,
                            complete: item.complete,
                            key: item.key
                        }
                        this.todoData.set(li.key, newTodo);
                        this.renderData();
                        this.addToStorage();
                    }
                })

            }

            if(target.matches('.todo-remove')) {
                li.classList.add('delete-li');
                timer = setTimeout(() => {
                    this.todoData.forEach(item => {
                        if(item.key === li.key) {
                            this.todoData.delete(li.key);
                            this.renderData();
                            this.addToStorage();
                        }
                    })
                }, 500)
            }

            if(target.matches('.todo-complete')) {
                if(target.closest('.todo-list')) {
                    this.todoData.forEach(item => {
                        if(item.key === li.key) {
                            item.complete = true;
                            this.renderData();
                            this.addToStorage();
                        }
                    })
                } else if(target.closest('.todo-completed')) {
                    this.todoData.forEach(item => {
                        if(item.key === li.key) {
                            item.complete = false;
                            this.renderData();
                            this.addToStorage();
                        }
                    })
                } 
            }
        }))
    }

    addToStorage(){
        localStorage.setItem('todo', JSON.stringify([...this.todoData]));
    }

    renderData(){
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createElement);
    }

    createElement = (elem) => {

        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = elem.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${elem.value}</span>
            <div class="todo-buttons">
                <button class="todo-edit"></button>
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);

        if(elem.complete) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e){
        e.preventDefault();

        if(this.input.value.trim()){
            const newTodo = {
                value: this.input.value,
                complete: false,
                key: this.generateKey()
            }
            this.todoData.set(newTodo.key, newTodo);
            this.addToStorage();
            this.renderData();
            this.input.value = '';
        } else alert('Заполните поле');
    }

    generateKey(){
        return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    init(){
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.handler();
        this.renderData();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();