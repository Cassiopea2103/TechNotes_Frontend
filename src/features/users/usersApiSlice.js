import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter= createEntityAdapter({})

const initialState= usersAdapter.getInitialState()

export const usersApiSlice= apiSlice.injectEndpoints(
    {
        endpoints: builder=> ({
            
            getAllUsers: builder.query({
                query: ()=> ({
                    url: '/users', 
                    validateStatus: ( response, result )=> {
                        return response.status === 200 && ! result.isError
                    }
                }),
                transformResponse: responseData=> {
                    
                    const loadedUsers= responseData.map((user)=> {
                        user.id= user._id

                        return user
                    })

                    return usersAdapter.setAll(initialState, loadedUsers)
                },
                
                providesTags: (result, error, arg)=> {
                    
                    if (result?.ids){
                        return [
                            {
                                type: 'Users',
                                id: 'LIST'
                            },
                            ...result.ids.map((id)=> ({type: 'Users', id}))
                        ]
                    }
                    else {
                        return [
                            {
                                type: 'Users',
                                id: 'LIST'
                            }
                        ]                        
                    }
                }
            }), 

            createUser: builder.mutation({
                query: (initialUserData)=> ({
                    url: '/users',
                    method: 'POST',
                    body: {
                        ...initialUserData
                    }
                }),
                invalidatesTags: [
                    {
                        type: 'Users',
                        id: 'LIST'
                    }
                ]
            }),
            
            updateUser: builder.mutation({
                query: (initialUserData)=> ({
                    url: '/users',
                    method: 'PATCH',
                    body: {
                        ...initialUserData
                    }
                }),
                invalidatesTags: (result, error, arg)=> [
                    {type: 'Users', id: arg.id}
                ]
            }),

            deleteUser: builder.mutation({
                query: ({ id })=> ({
                    url: '/users',
                    method: 'DELETE',
                    body: { id }
                }),
                invalidatesTags: (result, error, arg)=> [
                    {
                        type: 'Users',
                        id: arg.id
                    }
                ]
            })
        })
        
    }
)

// slice hooks: 
export const {
    useGetAllUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
}= usersApiSlice

// query object: 
const fetchUsersQueryObject= usersApiSlice.endpoints.getAllUsers.select()

// query data: memoized selector: 
const fetchUsersQueryData= createSelector(
    [ fetchUsersQueryObject ],
    queryObject=> queryObject.data
)

// usersAdapter selectors: 
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectEntities: selectUserEntities,
    selectIds: selectUserIds
}= usersAdapter.getSelectors(state=> fetchUsersQueryData(state) ?? initialState)