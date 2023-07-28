import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import { getMe, deleteCard } from "../utils/API";
import Auth from "../utils/auth";
import { removeCardId } from "../utils/localStorage";

import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_CARD } from "../utils/mutations";
import { GET_ME } from "../utils/queries";

const SavedCards = () => {
    const { loading, data } = useQuery(GET_ME);
    const [removeCard, { error }] = useMutation(REMOVE_CARD);
  
    const userData = data?.me || {};
}

export default SavedCards;