import { gql } from '@apollo/client'

const WRITER_DETAILS = gql`
  fragment WriterDetails on Writer {
    name
    born
    volumeCount
    id
  }
`

const VOLUME_DETAILS = gql`
  fragment VolumeDetails on Volume {
    title
    published
    writer {
      name
    }
    genres
    id
  }
`

const EXTENDED_VOLUME_DETAILS = gql`
  fragment ExtendedVolumeDetails on Volume {
    ...VolumeDetails
    writer {
      ...WriterDetails
    }
  }
  ${VOLUME_DETAILS}
  ${WRITER_DETAILS}
`

export const ALL_WRITERS = gql`
  query {
    allWriters {
      ...WriterDetails
    }
  }
  ${WRITER_DETAILS}
`

export const ALL_VOLUMES = gql`
  query($genre: String) {
    allVolumes(genre: $genre) {
      ...VolumeDetails
    }
  }
  ${VOLUME_DETAILS}
`

export const ADD_VOLUME = gql`
  mutation createVolume(
    $title: String!,
    $published: Int!,
    $writer: String!,
    $genres: [String]!
  ) {
    addVolume(
      title: $title
      published: $published
      writer: $writer
      genres: $genres
    ) {
      ...ExtendedVolumeDetails
    }
  }
  ${EXTENDED_VOLUME_DETAILS}
`

export const EDIT_WRITER = gql`
  mutation editWriter($name: String!, $setBornTo: Int!) {
    editWriter(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const VOLUME_ADDED = gql`
  subscription {
    volumeAdded {
      ...ExtendedVolumeDetails
    }
  }
  ${EXTENDED_VOLUME_DETAILS}
`
