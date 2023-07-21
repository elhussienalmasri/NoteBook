import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteContext from '../context/notes/noteContext'
import EditNote from './EditNote';
import NoteItems from './NoteItems';
import {  useNavigate} from "react-router-dom";



function Notes(props) {
    const context = useContext(NoteContext);
    const { notes, getNote, editNote ,getpagination,pages,sortPag,numberOfPages} = context;
    const [enote, setenote] = useState({ id: "", title: "", description: "", tag: "default" })
    const navigate = useNavigate();
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState("newest");
    const [tag, setTags] = useState("All");
    const [pageNumber, setPageNumber] = useState(0);
   

  
    const transformedNotes = () => {
      let sortedNotes = notes;
      sortedNotes = sortedNotes.sort((a, b) => {
        const aCreatedAt = new Date(a.date);
        const bCreatedAt = new Date(b.date);
        return sort === "newest"
          ? bCreatedAt - aCreatedAt
          : aCreatedAt - bCreatedAt;
      });
      if (tag==="All"&&search===""){
            sortedNotes =sortPag
      }

      if (tag && tag !== "All") {
        sortedNotes = sortedNotes?.filter(
          (item) => item.tag.toLowerCase() === tag.toLowerCase()
        );
      }

      return sortedNotes;
    };

    useEffect(() => {}, [notes]);
    useEffect(() => {
      if (localStorage.getItem("token")) {
        getNote();
      } else {
        navigate("/login");
      }
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (localStorage.getItem("token")) {
        
        getpagination(pageNumber);

        
        
      } else {
        navigate("/login");
      }
      // eslint-disable-next-line
    }, [pageNumber]);

    const ref = useRef(null);
    const refclose = useRef(null);

    const updateNote = (currentNote) => {
      ref.current.click();
      setenote(currentNote);
    };

    const onchange = (e) => {
      setenote({ ...enote, [e.target.name]: e.target.value });
    };

    const handleEdit = (e) => {
      e.preventDefault();
      editNote(enote._id, enote.title, enote.description, enote.tag);
      refclose.current.click();

      props.showAlert("Note is updated successfully", "success");
    };

    const gotoPrevious = () => {
      setPageNumber(Math.max(0, pageNumber - 1));
    };
  
    const gotoNext = () => {
      setPageNumber(Math.min(numberOfPages - 1, pageNumber + 1));
    };

    return (
      <>
        <div className="my-5">
          <div>
            <h3>🧾 Your Notes:</h3>
          </div>
          <div className="d-flex py-3     justify-content-center">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value.toLowerCase());
              }}
            />
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <span className="">Date </span>
              <select className="" onChange={(e) => setSort(e.target.value)}>
                <option disabled>By date</option>
                <option value="newest">newest</option>
                <option value="oldest">oldest</option>
              </select>
            </div>
            <div className="m-2">
              <label htmlFor="tag" className="form-label">
                Tag
              </label>
              <select onChange={(e) => setTags(e.target.value)}>
                <option value="All">All</option>
                <option value="Todo">Todo</option>
                <option value="Important">Important</option>
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>
        
        <EditNote
          reference={ref}
          closeref={refclose}
          enote={enote}
          onchange={onchange}
          handleChange={handleEdit}
        />

        <div className="row mb-5 ">
          {
            search==="" && tag==="All"  && numberOfPages>1  &&
            <h3 class="text-start mb-3"  >Page  {pageNumber + 1} of {numberOfPages} Pages </h3>
          }
      
          <div className="mx-3">
            {notes.length === 0 && "No notes to display.."}
          </div>
          {transformedNotes()
            .filter((item) => {
              return item.title.toLowerCase().includes(search) && item;
            })
            .map((note) => {
              return (
                <NoteItems
                  key={note._id}
                  note={note}
                  updateNote={updateNote}
                  showAlert={props.showAlert}
                />
              );
            })}

          {search === "" && tag === "All"   && numberOfPages>1&&

            <div className='d-flex justify-content-start my-3'>
              <button disabled={pageNumber===0} onClick={gotoPrevious} className="btn focusNone start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z" />
                </svg>
              </button>
              {pages.map((pageIndex) => (
                <div className='text-center'>
                
                  <button className={pageNumber === pageIndex ? "btn btn-primary" : "btn"} key={pageIndex} onClick={() => { setPageNumber(pageIndex) }}>
                   
                    {pageIndex + 1}
                   

                  </button>
                
                </div>
              ))}
              <button disabled={pageNumber+1===numberOfPages}  onClick={gotoNext} className="btn focusNone">

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z" />
                </svg>
              </button>
            </div>

          }
        </div>
      </>
    );
}

export default Notes


