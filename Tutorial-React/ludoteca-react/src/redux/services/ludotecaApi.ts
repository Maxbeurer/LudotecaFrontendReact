import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Game } from "../../types/Game";
import { Category } from "../../types/Category";
import { Client } from "../../types/Client";
import { Author, AuthorResponse } from "../../types/Author";
import { Loan, LoanResponse } from "../../types/Loan";

export const ludotecaAPI = createApi({
  reducerPath: "ludotecaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
  }),
  tagTypes: ["Category", "Author", "Game", "Client", "Loan"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], null>({
      query: () => "category",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/category",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (payload: Category) => ({
        url: `category/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
    getClients: builder.query<Client[], null>({
      query: () => "client",
      providesTags: ["Client"],
    }),
    createClient: builder.mutation({
      query: (payload) => ({
        url: "/client",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Client"],
    }),
    deleteClient: builder.mutation({
      query: (id: string) => ({
        url: `/client/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Client"],
    }),
    updateClient: builder.mutation({
      query: (payload: Category) => ({
        url: `client/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Client"],
    }),
    getAllAuthors: builder.query<Author[], null>({
      query: () => "author",
      providesTags: ["Author"],
    }),
    getAuthors: builder.query<
      AuthorResponse,
      { pageNumber: number; pageSize: number }
    >({
      query: ({ pageNumber, pageSize }) => {
        return {
          url: "author",
          method: "POST",
          body: {
            pageable: {
              pageNumber,
              pageSize,
            },
          },
        };
      },
      providesTags: ["Author"],
    }),
    createAuthor: builder.mutation({
      query: (payload) => ({
        url: "/author",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Author"],
    }),
    deleteAuthor: builder.mutation({
      query: (id: string) => ({
        url: `/author/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),
    updateAuthor: builder.mutation({
      query: (payload: Author) => ({
        url: `author/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Author", "Game"],
    }),
    getAllGames: builder.query<Game[], null>({
      query: () => "game",
      providesTags: ["Game"],
    }),

    createGame: builder.mutation({
      query: (payload: Game) => ({
        url: "/game",
        method: "PUT",
        body: { ...payload },
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Game"],
    }),
    updateGame: builder.mutation({
      query: (payload: Game) => ({
        url: `game/${payload.id}`,
        method: "PUT",
        body: { ...payload },
      }),
      invalidatesTags: ["Game"],
    }),
    getAllLoans: builder.query<Loan[], null>({
      query: () => "loan",
      providesTags: ["Loan"],
    }),
    getGames: builder.query<Game[], { title: string; idCategory: string }>({
      query: ({ title, idCategory }) => {
        return {
          url: "game/",
          params: { title, idCategory },
        };
      },
      providesTags: ["Game"],
    }),
    getLoans: builder.query<LoanResponse,{ pageNumber: number; pageSize: number; idGame: string ; idClient: string ; date : string | undefined}>({
      query: ({ pageNumber, pageSize, idGame, idClient, date}) => {
        const dateString = date? date : undefined;
        return {
          url: "loan",
          method: "POST",
          body: {
            pageable: {
              pageNumber,
              pageSize,
            },
            
          },
          params: {idGame, idClient, dateString}
        };
      },
      providesTags: ["Loan"],
    }),
    createLoan: builder.mutation({
      query: (payload) => ({
        url: "/loan",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Loan"],
    }),
    deleteLoan: builder.mutation({
      query: (id: string) => ({
        url: `/loan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Loan"],
    }),

  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
  useUpdateClientMutation,
  useCreateAuthorMutation,
  useDeleteAuthorMutation,
  useGetAllAuthorsQuery,
  useGetAuthorsQuery,
  useUpdateAuthorMutation,
  useCreateGameMutation,
  useGetAllGamesQuery,
  useGetGamesQuery,
  useUpdateGameMutation,
  useCreateLoanMutation,
  useDeleteLoanMutation,
  useGetAllLoansQuery,
  useGetLoansQuery
} = ludotecaAPI;