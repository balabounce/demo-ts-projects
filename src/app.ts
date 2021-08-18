// Code goes here!
interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus {
    Active,
    Finished
}

interface Project {
    title: string,
    description: string,
    people: number,
    status: ProjectStatus
}

interface ValidatableConditionsInterface {
    required: boolean,
    min?: number,
    max?: number,
    minLength?: number,
    maxLength?: number
}

const validate = (ValidateObj: ValidatableConditionsInterface, input: string | number) => {
    let isValid = true;
    if(ValidateObj.required) {
        isValid = isValid && !!input;
    }
    if(ValidateObj.minLength) {
        isValid = isValid && input.toString().length >= ValidateObj.minLength;
    }
    if(ValidateObj.maxLength) {
        isValid = isValid && input.toString().length <= ValidateObj.maxLength;
    }
    if(ValidateObj.min) {
        isValid = isValid && +input >= ValidateObj.min;
    }
    if(ValidateObj.max) {
        isValid = isValid && +input <= ValidateObj.max;
    }
    if(!isValid) console.log(input);
    return isValid
}

const render = (id: string):void => {
    let template:HTMLTemplateElement = document.querySelector(id)!;
    let temp = template!.content;
    let elem = temp!.cloneNode(true);
    document.body.appendChild(elem);
    if(id === '#project-input') {
        document.querySelector('form')!.id = 'user-input';
    }
    if(id === '#project-list') {
        document.querySelector('section')!.id = 'active-projects';
        elem = temp!.cloneNode(true);
        document.body.appendChild(elem);
        document.querySelector('#active-projects')!.nextElementSibling!.id = 'finished-projects';
        document.querySelector('#finished-projects > header > h2')!.textContent = 'Finished Projects'
    }
    template.parentNode!.removeChild(template)
}

const dragAndDrop = (dragElem: HTMLElement) => {
    const whereToDropElem: HTMLElement = document.querySelector('#finished-projects')!;

    dragElem.ondragstart = event => {
        // event.preventDefault();
        const target = event.target as HTMLElement;
        const dataTransfer = event.dataTransfer;
        dragElem.parentElement!.classList.add('droppable');
        dragElem.style.backgroundColor = 'white';
        whereToDropElem.querySelector('ul')?.classList.add('droppable');
        dataTransfer!.setData('id', target.id);
        // dataTransfer!.setData("text/html", dragElem.outerHTML);
        console.log(dataTransfer);
    }

    whereToDropElem.ondragover = (event) => {
        event.preventDefault();
        // console.log(dataTransfer);
        event.dataTransfer!.dropEffect = 'move';
        dragElem.parentElement!.classList.remove('droppable');
    } 

    whereToDropElem.ondrop = (event) => {
        // event.preventDefault();
        const data = event.dataTransfer!.getData("id");
        const target = event.target as HTMLElement;
        console.log(target)
        if(target.classList.contains('droppable') ){
            let item =  document.getElementById(data)!;
            target.append(item);
            item.id = `FP-${item.parentElement!.children.length}`;
            let title:HTMLElement = item.querySelector('.title')!; 
            title.style.color = 'blue';
        }
        // console.log(data)
    } 

    dragElem.ondragend = event => {
        event.preventDefault()
        dragElem.parentElement!.classList.remove('droppable');
        whereToDropElem.querySelector('ul')?.classList.remove('droppable');
    }

}

const renderProj = (title: string, description: string, people: number): void => {
    const projList = document.querySelector('.projects > ul')!;
    const item = document.createElement('li');
    item.draggable = true;
    item.style.display = 'flex';
    item.style.flexDirection = 'column';
    item.style.padding = '15px auto'
    dragAndDrop(item);
   
    const titleElem = document.createElement('span');
    titleElem.classList.add('title');
    titleElem.style.color = 'red';
    titleElem.style.fontSize = '30px';
    titleElem.style.marginBottom = '15px';
    titleElem.textContent = `${title}\n`; 
    item.appendChild(titleElem)

    const descrElem = document.createElement('span');
    descrElem.classList.add('description');
    descrElem.textContent = description; 
    descrElem.style.marginBottom = '15px';
    item.appendChild(descrElem)

    const peopleElem = document.createElement('span');
    peopleElem.classList.add('people');
    people === 1 ? peopleElem.textContent = `${people} Person assigned` : peopleElem.textContent = `${people} Persons assigned`
    item.appendChild(peopleElem)

    console.log(item.childNodes)
    // item.textContent = `${title}\t\t\t\t\t${description}\t\t\t\t\t${people}`;
    projList.append(item); 
    item.id = `AP-${item.parentElement!.children.length}`;

}

let projArr: Project[] = []
 
render('#project-input');
// render('#single-project');
render('#project-list');
let title: string, description: string;
let people: number;

let validateTitleObj: ValidatableConditionsInterface = {
    required: true,
    minLength: 4,
    maxLength: 10
}

let validateDescriptionObj: ValidatableConditionsInterface = {
    required: true,
    minLength: 5,
    maxLength: 100
}

let validatePeopleObj: ValidatableConditionsInterface = {
    required: true,
    min: 1,
    max: 10
}

let inpTitle:HTMLInputElement = document.querySelector('#title')!;
inpTitle.addEventListener('change', () => {
    title = inpTitle.value;
});
let inpDescr:HTMLInputElement = document.querySelector('#description')!;
inpDescr.addEventListener('change', () => {
    description = inpDescr.value;
});
let inpPeop:HTMLInputElement = document.querySelector('#people')!;
inpPeop.addEventListener('change', () => {
    if(typeof(+inpPeop.value) === 'number' && +inpPeop.value > 0 && +inpPeop.value <= 10 ){
        people = +inpPeop.value;
    }
});
let button: HTMLButtonElement = document.querySelector('button')!;
button.addEventListener('click', (event) => {
    event.preventDefault();
    console.log(validate(validateDescriptionObj, description), (validate(validateTitleObj, title), validate(validatePeopleObj, people)));
    if(validate(validateDescriptionObj, description) && validate(validateTitleObj, title) && validate(validatePeopleObj, people)) {
        projArr.push({
            title: title.trim(),
            description: description.trim(),
            people: people,
            status: 1
        });
        inpPeop.value = '', inpDescr.value = '', inpTitle.value = '';
        renderProj(title, description, people);
        title = '', description = '', people = 0;
        console.log(projArr)
    } else {
        alert('Invalid input, pleast try again');
    }
});




