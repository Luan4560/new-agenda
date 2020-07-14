import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';

import { cpfMask, telefoneMask } from '../utils';
import api from '../service/api';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',

    width: 400,
    height: 200,
  },
};

const SimpleModal = ({ title, id, load, data }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState([]);
  const [cpf, setCpf] = useState([]);
  const [phone, setPhone] = useState([]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleInputChange = useCallback(event => {
    if (event.target.name === 'cpf') {
      setCpf(cpfMask(event.target.value));
    } else if (event.target.name === 'phone') {
      setPhone(telefoneMask(event.target.value));
    } else if (event.target.name === 'nome') {
      setNome(event.target.value);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    await api.patch(`auth/update/${id}`, { username: nome, cpf, phone });
    load();
  }, [cpf, id, load, nome, phone]);

  return (
    <div>
      <button type="button" onClick={openModal}>
        Atualizar
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>{title}</h2>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          required
          onChange={handleInputChange}
          // value={}
        />

        {console.log(data)}
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          required
          onChange={handleInputChange}
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder="Telefone"
          onChange={handleInputChange}
        />
        <button type="submit" onClick={handleSubmit}>
          Atualizar
        </button>
      </Modal>
    </div>
  );
};

export default SimpleModal;
