import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';

import { ELECTRIC_BILLING_ELEMENTS_QUERY } from '../queries';
import { REMOVE_ELECTRIC_BILLING_ELEMENT } from '../mutations';

import Pagination from './Pagination';

const ElectricBillingElements = () => {
  const limit = 10;
  const [pagination, setPagination] = useState({

    offset: 0,
    current: 1,

  });

  const { loading, error, data } = useQuery(ELECTRIC_BILLING_ELEMENTS_QUERY, {
    variables: { limit, offset: pagination.offset },
    pollInterval: 500,
  });
  const [removeElectricBillingElement] = useMutation(REMOVE_ELECTRIC_BILLING_ELEMENT);

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;

  const previousPage = () => {
    setPagination({
      ...pagination,
      offset: pagination.offset - limit,
      current: pagination.current - 1,
    });
  };

  const nextPage = () => {
    setPagination({
      ...pagination,
      offset: pagination.offset + limit,
      current: pagination.current + 1,
    });
  };

  return (
    <>
      <h2 className="text-center">Electric Billing Elements List</h2>
      <ul className="list-group mt-4">
        {data.getElectricBillingElements.map((electricBillingElement) => (
          <li key={electricBillingElement.id} className="list-group-item">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-8 d-flex justify-content-between align-items-center">
                Date:
                {' '}
                {electricBillingElement.date}
                {' '}
                - Hour:
                {' '}
                {electricBillingElement.hour}
                {' '}
                - Ingestion(Wh):
                {' '}
                {electricBillingElement.ingestion}
                {' '}
                - Cost:
                {' '}
                {electricBillingElement.cost}
              </div>
              <div className="col-md-4 d-flex justify-content-end">

                <button
                  type="button"
                  className="btn btn-danger d-block d-md-inline-block mr-2"
                  onClick={() => {
                    // eslint-disable-next-line no-alert
                    if (window.confirm('Are you sure you want to delete this electric billing element?')) {
                      removeElectricBillingElement({
                        variables: { id: electricBillingElement.id },
                      });
                    }
                  }}
                >
                  &times; Remove
                </button>
                <Link
                  to={`/electricbillingelement/edit/${electricBillingElement.id}`}
                  className="btn btn-success d-block d-md-inline-blok"
                >
                  Edit electric billing element
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        current={pagination.current}
        totalElectricBillingElements={data.totalElectricBillingElements}
        limit={limit}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </>
  );
};

export default ElectricBillingElements;
