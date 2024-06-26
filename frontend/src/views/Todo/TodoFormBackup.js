import React, {useEffect, useState} from "react";
import {Button, Form, FormGroup, Label, Input, Table} from 'reactstrap';


function TodoForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('');
    const [todos, setTodos] = useState([]);
    const STATUS_LABELS = {
        new: 'New',
        in_progress: 'In Progress',
        done: 'Done',
    };
    useEffect(function () {
        fetchTodos();
    }, []);

    function fetchTodos() {
        fetch('http://127.0.0.1:8000/todos/', {method: "GET"})
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setTodos(data);
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }


    function handleSubmit(event) {
        event.preventDefault();

        const formData = {
            title: title,
            description: description,
            due_date: dueDate,
            status: status
        };

        fetch('http://127.0.0.1:8000/todos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }
        )
            .then(function (response) {
                if (!response) {
                    throw new Error('Response is undefined');
                }
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function (data) {
                console.log('Todo added', data);
                setTodos([data, ...todos]);
                setTitle('');
                setDescription('');
                setDueDate('');
                setStatus('');
            })
    }

    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value);
    }

    function handleDueDateChange(event) {
        setDueDate(event.target.value);
    }

    function handleStatusChange(event) {
        setStatus(event.target.value);
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="Enter todo title"
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                        id="description"
                        name="description"
                        placeholder="Enter todo description"
                        type="textarea"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={handleDueDateChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="status">Status</Label>
                    <Input
                        id="status"
                        name="status"
                        type="select"
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <option value="">Select Status</option>
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </Input>
                </FormGroup>
                <Button type="submit" disabled={!status}>Submit</Button>
            </Form>
            <Table>
                <thead>
                <tr className="table-info">
                    <th>Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {todos.map(function (todo) {
                    let className = '';
                    switch (todo.status) {
                        case 'new':
                            className = 'table-danger';
                            break;
                        case 'in_progress':
                            className = 'table-warning';
                            break;
                        case 'done':
                            className = 'table-success';
                            break;
                        default:
                            className = 'new';
                    }
                    return (
                        <tr key={todo.id} className={className}>

                            <td>{todo.title}</td>
                            <td>{todo.description}</td>
                            <td>{todo.due_date}</td>
                            <td>{STATUS_LABELS[todo.status] || todo.status}</td>
                        </tr>
                    );
                })}
                </tbody>

            </Table>
        </>
    );
}

export default TodoForm;