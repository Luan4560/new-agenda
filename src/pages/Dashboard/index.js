import React, { useState, useEffect, useCallback } from 'react';

import { Container, Form, StyleTr } from './style';
import { cpfMask, telefoneMask } from '../../utils';
import UpdateModal from '../../components';
import api from '../../service/api';

const Dashboard = () => {
  const [maskCpf, setMaskCpf] = useState();
  const [maskPhone, setMaskPhone] = useState([]);
  const [maskNome, setMaskNome] = useState([]);
  const [userData, setUserData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  console.log(userData);
  const [valueSearched, setValueSearched] = useState('');

  const loadData = useCallback(async () => {
    const data = {
      texto: valueSearched,
    };
    const response = await api.post('auth/find', data);
    setUserData(response.data);
  }, [valueSearched]);

  useEffect(() => {
    loadData();
  }, [loadData, valueSearched]);

  const handleInputChange = useCallback(event => {
    if (event.target.name === 'cpf') {
      setMaskCpf(cpfMask(event.target.value));
    } else if (event.target.name === 'phone') {
      setMaskPhone(telefoneMask(event.target.value));
    } else if (event.target.name === 'nome') {
      setMaskNome(event.target.value);
    }
  }, []);

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      const userInfo = {
        username: maskNome,
        cpf: maskCpf,
        phone: maskPhone,
      };
      setSubmitting(true);
      try {
        const response = await api.post('auth/register', userInfo);

        const newData = userData.push(response.data);
        setUserData(userData);
        if (response) {
          setSubmitting(false);
        }

        return response;
      } catch (err) {
        return err;
      }
    },
    [maskCpf, maskNome, maskPhone, userData]
  );

  const handleDelete = useCallback(
    async id => {
      await api.delete(`auth/delete/${id}`);
      loadData();
    },
    [loadData]
  );

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          onChange={handleInputChange}
          value={maskCpf}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Telefone"
          value={maskPhone}
          onChange={handleInputChange}
        />
        <button type="submit">Adicionar</button>
      </Form>
      <input
        type="text"
        id="value-search"
        placeholder="Search"
        onChange={e => setValueSearched(e.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setValueSearched(document.getElementById('value-search').value)
        }
      >
        Buscar
      </button>
      <div className="tabela">
        <table>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Alterar</th>
          </tr>

          {userData.map(data => (
            <StyleTr key={data.id}>
              <td>{data.username}</td>
              <td>{data.cpf}</td>
              <td>{data.phone}</td>
              <button type="button" onClick={() => handleDelete(data.id)}>
                Deletar
              </button>
              <UpdateModal load={loadData} id={data.id} />
            </StyleTr>
          ))}
        </table>
      </div>
    </Container>
  );
};
export default Dashboard;
