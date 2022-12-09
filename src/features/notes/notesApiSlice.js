import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter= createEntityAdapter(
    {
        sortComparer: (noteA, noteB)=> 
            noteA.completed === noteB.completed
            ? 0 : noteA.completed   
                ? 1 : -1
    }
)

const initialState= notesAdapter.getInitialState()

export const notesApiSlice= apiSlice.injectEndpoints(
    {
        endpoints: builder=> (
            {
                
                getAllNotes: builder.query({
                    query: ()=> ({
                        url: '/notes',
                        validateStatus: ( response, result )=> {
                            return response.status === 200 && !result.isError
                        }
                    }),
                    transformResponse: responseData=> {
                        
                        const loadedNotes= responseData.map((note)=> {
                            note.id= note._id 

                            return note
                        })

                        return notesAdapter.setAll(initialState, loadedNotes)
                    },
                    providesTags: (result, error, arg)=> {
                        if (result?.ids){
                            return [
                                {
                                    type: 'Notes',
                                    id: 'LIST'
                                },
                                ...result.ids.map((id)=> ({
                                    type: 'Notes',
                                    id
                                }))
                            ]
                        }
                        else {
                            return [
                                {
                                    type: 'Notes',
                                    id: 'LIST'
                                }
                            ]
                        }
                    }
                }),

                createNote: builder.mutation(
                    {
                        query: (initialNoteData)=> (
                            {
                                url: '/notes',
                                method: 'POST',
                                body: {
                                    ...initialNoteData
                                }
                            }
                        ),
                        invalidatesTags: [
                            {
                                type: 'Notes',
                                id: 'LIST' 
                            }
                        ]
                    }
                ),

                updateNote: builder.mutation(
                    {
                        query: (initialNoteData)=> (
                            {
                                url: '/notes',
                                method: 'PATCH',
                                body: {
                                    ...initialNoteData
                                }
                            }
                        ),
                        invalidatesTags: (result, error, arg)=> [
                            {
                                type: 'Notes',
                                id: arg.id
                            }
                        ]
                    }
                ),

                deleteNote: builder.mutation(
                    {
                        query: ({ id })=> ({
                            url: '/notes',
                            method: 'DELETE',
                            body: { id }
                        }), 
                        invalidatesTags: (result, error, arg)=> [
                            {
                                type: 'Notes',
                                id: 'LIST'
                            }
                        ]
                    }
                )
            }
        )
    }
)

// api hooks: 
export const {
    useGetAllNotesQuery,
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
}= notesApiSlice

// fetch notes query object: 
const fetchNotesQueryObject= notesApiSlice.endpoints.getAllNotes.select()

// memoized selector: 
const fetchNotesQueryData= createSelector(
    [ fetchNotesQueryObject ],
    queryObject=> queryObject.data
)

// notes adapter selectors: 
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectEntities: selectNoteEntities,
    selectIds: selectNoteids
}= notesAdapter.getSelectors(state=> fetchNotesQueryData(state) ?? initialState)