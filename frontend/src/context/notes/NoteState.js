import NoteContext from "./noteContext";
import React, { useState } from "react";

const NoteState = (props) => {
  const notesInitial = [];

  const [notes, setnotes] = useState(notesInitial);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [sortPag,setSortPag,] = useState([]);
  console.log(sortPag);
  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);

  //get all notes
  const getNote = async () => {
    const response = await fetch("api/notes/fetchallnotes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    setnotes(json);
  };
  
    //get pagintaion
    const getpagination = async (pageNumber) => {
      const response = await fetch( `api/notes/pagination?page=${pageNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      const result =()=> response.json()
        .then(({ totalPages, notes }) => {
        setSortPag(notes);
        setNumberOfPages(totalPages);
      })
     
      result();
      // console.log(sortPag)
      // console.log(numberOfPages)
    };

  //add a note
  const addNote = async (title, description, tag) => {
    const response = await fetch("api/notes/addnote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const note = await response.json();
    setnotes(notes.concat(note));
  };

  //delete a note
  const deleteNote = async (id) => {
    //a\Api call to delete
    const response = await fetch(`api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    console.log(json);

    //Clint side code
    const newnotes = notes.filter((note) => {
      return id !== note._id;
    });
    setnotes(newnotes);
  };

  //edit a note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNote = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNote.length; index++) {
      let element = newNote[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
        break;
      }
    }
    setnotes(newNote);
  };

  return (
    <NoteContext.Provider value={{ notes, getNote, addNote, deleteNote, editNote ,getpagination,pages,sortPag,numberOfPages}}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
