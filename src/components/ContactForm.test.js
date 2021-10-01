import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

const fn = /first name*/i;
const fnd = "firstnameDisplay";
const fni = "First Name: ";
const ln = /last name*/i;
const lnd = "lastnameDisplay";
const lni = "Last Name: ";
const em = /email*/i;
const emd = "emailDisplay";
const emi = "Email: ";
const me = /message/i;
const med = "messageDisplay";
const mei = "Message: ";
const start = () => render(<ContactForm/>);
const input = (labelText, putIn) => {
  const input = screen.getByLabelText(labelText);
  userEvent.type(input, putIn);
}
const submit = () => {
  const button = screen.getByRole("button");
  userEvent.click(button);
}
const display = (testID, intro, input) => {
  const display = screen.getByTestId(testID);
  expect(display).toHaveTextContent(intro + input);
}
const errors = length => {
  const errorMessages = screen.getAllByTestId("error");
  expect(errorMessages).toHaveLength(length);
}
const hasError = text => screen.getByText(text);

test('renders without errors', ()=>{
  start();
});

test('renders the contact form header', ()=> {
  start();
  const headerEl = screen.getByText(/contact form/i);
  expect(headerEl).toBeInTheDocument();
  expect(headerEl).toBeTruthy();
  expect(headerEl).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  start();
  input(fn, "John");
  errors(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  start();
  submit();
  errors(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  start();
  input(fn, "Jonathon");
  input(ln, "Smith");
  submit();
  errors(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  start();
  input(em, "Not an email");
  errors(1);
  hasError(/email must be a valid email address/i);
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  start();
  submit();
  hasError(/lastName is a required field/i);
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  const FN = "Jonathon";
  const LN = "Smith";
  const EM = "jonathon.smith@gmail.com";

  start();
  input(fn, FN);
  input(ln, LN);
  input(em, EM);
  submit();

  display(fnd, fni, FN);
  display(lnd, lni, LN);
  display(emd, emi, EM);
  const messageDisplay = screen.queryByTestId("messageDisplay");
  expect(messageDisplay).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
  const FN = "Jonathon";
  const LN = "Smith";
  const EM = "jonathon.smith@gmail.com";
  const ME = "I'm always available";

  start();
  input(fn, FN);
  input(ln, LN);
  input(em, EM)
  input(me, ME)
  submit();

  display(fnd, fni, FN);
  display(lnd, lni, LN);
  display(emd, emi, EM);
  display(med, mei, ME);
});