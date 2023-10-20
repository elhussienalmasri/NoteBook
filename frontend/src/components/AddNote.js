import React, { useContext, useState, useEffect, useRef } from 'react';
import NoteContext from '../context/notes/noteContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { Editor } from '@tinymce/tinymce-react';

function AddNote(props) {
    const location = useLocation();
    const context = useContext(NoteContext);
    const { addNote, getNote } = context;

    const [note, setnote] = useState({ title: "", tag: "Todo" })

    const [editorKey, setEditorKey] = useState(4);

    const navigate = useNavigate();

    const editorRef = useRef(null);


    const clearEditor = () => {
        const newKey = editorKey * 43;
        setEditorKey(newKey);
    }



    const onchange = (e) => {
        setnote({ ...note, [e.target.name]: e.target.value })

    }

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, editorRef.current.getContent(), note.tag)
        setnote({ title: "", tag: "" })

        clearEditor()
        props.showAlert("Note added successfully", "success")


    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNote()
        } else {
            navigate('/login')

        }
        // eslint-disable-next-line

    }, [])

    return (
        <div>
            <div className='my-4'>
                <div className="text-center">
                    <h3>✍🏻 Add A New Note:</h3>
                </div>
                <div className="mb-3 my-4">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <select className="form-select" aria-label="Default select example" id="tag" value={note.tag} onChange={onchange} name="tag">

                        <option value="Todo">Todo</option>
                        <option value="Important">Important</option>
                        <option value="Academic">Academic</option>
                        <option value="Personal">Personal</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div className="mb-3 ">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" value={note.title} onChange={onchange} name="title" />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    {/* <textarea className="form-control" id="description" name="description"  value={note.description} onChange={onchange} rows="3"></textarea> */}

                    <Editor
                        key={editorKey}
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue="<p>This is the initial content of the editor.</p>"
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}

                    />

                </div>

                <div className='text-center'>
                    <button className='btn btn-primary' onClick={handleClick}>Add Note</button>
                </div>
            </div>

            <div className="text-center">
                <Link to="/notes" className={`nav-link ${location.pathname === "/notes" ? "active" : ""}`} aria-current="page" >Your Notes</Link>
            </div>
        </div>
    )
}

export default AddNote
