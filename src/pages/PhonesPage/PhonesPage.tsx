import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Pagination } from '../../components/Pagination/Pagination';
import './PhonesPage.scss';
import { useAppSelector } from '../../store';
import { getSearchWith } from '../../helpers/searchHelper';

enum SortType {
  Newest = 'Newest',
  Alphabetically = 'Alphabetically',
  Cheapest = 'Cheapest',
}

enum OptionsType {
  All = 'All',
  _4 = '4',
  _8 = '8',
  _16 = '16',
}

export const PhonesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryValue: string = searchParams.get('query') || '';
  const sortValue: string = searchParams.get('sort') || '';
  const phones = useAppSelector(state => state.phones.items);
  const itemWidth = useAppSelector(state => state.phones.itemWidth);
  const count = useAppSelector(state => state.phones.count);

  const [perPage, setPerPage] = useState(searchParams.get('perPage') || 'All');
  const [currentPage, setCurrentPage] = useState(searchParams.get('page') || 1);
  const [types, setTypes] = useState(sortValue || 'Newest');

  useEffect(() => {
    if (currentPage !== 1) {
      setSearchParams(
        getSearchWith(searchParams, { page: currentPage.toString() }),
      );
    } else {
      setSearchParams(getSearchWith(searchParams, { page: null }));
    }
  }, [currentPage]);

  const getActualPhones = (value: string) => {
    const sortedPhones = [...phones].filter(phone =>
      phone.name
        .toLocaleLowerCase()
        .trim()
        .includes(queryValue.toLocaleLowerCase().trim()),
    );

    switch (value) {
      case SortType.Newest:
        return sortedPhones.sort((a, b) => b.year - a.year);
      case SortType.Alphabetically:
        return sortedPhones.sort((a, b) => a.name.localeCompare(b.name));
      case SortType.Cheapest:
        return sortedPhones.sort((a, b) => a.price - b.price);
      default:
        return sortedPhones;
    }
  };

  const options = ['All', '4', '8', '16'];
  const sortType = ['Newest', 'Alphabetically', 'Cheapest'];

  const actualPhones = getActualPhones(types);

  const total = actualPhones.length || phones.length;
  const startItemIndex = (+currentPage - 1) * +perPage;
  const endItemIndex = Math.min(+currentPage * +perPage, total);
  const visibleItems = actualPhones.slice(startItemIndex, endItemIndex);

  useEffect(() => {
    if (total !== 0 && total < +currentPage * 4 - 3) {
      setCurrentPage(1);
    }
  }, [queryValue]);

  const optionEvent = (event: ChangeEvent<HTMLSelectElement>) => {
    if (
      Object.values(OptionsType).includes(event.target.value as OptionsType)
    ) {
      setPerPage(event.target.value);

      if (event.target.value !== 'All') {
        setSearchParams(
          getSearchWith(searchParams, {
            perPage: event.target.value,
          }),
        );
      } else {
        setSearchParams(
          getSearchWith(searchParams, {
            perPage: null,
          }),
        );
      }
    }

    if (Object.values(SortType).includes(event.target.value as SortType)) {
      setTypes(event.target.value);
      setSearchParams(
        getSearchWith(searchParams, {
          sort: event.target.value,
        }),
      );
    }

    setCurrentPage(1);
  };

  return (
    <div className="Phones-page">
      <div className="top-link" data-cy="breadCrumbs">
        <Link to="/">
          <img src="./img/Home.png" alt="Home" className="top-link__img" />
        </Link>

        <img
          src="./img/UpperLink.png"
          alt="ArrowRight"
          className="top-link__img"
        />

        <p>Phones</p>
      </div>

      <h1 className="Phones-page__Header">Mobile Phones</h1>

      <p>{`${actualPhones.length} models`}</p>

      <div className="Options">
        <div className="Options__sort">
          <label htmlFor="sort-options">Sort by</label>

          <select
            className="selector__sort"
            id="sort-options"
            value={types}
            onChange={event => optionEvent(event)}
          >
            {sortType.map(type => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="Options__count">
          <label htmlFor="count-options">Items on page</label>

          <select
            className="selector__count"
            id="count-options"
            value={perPage}
            onChange={event => optionEvent(event)}
          >
            {options.map(option => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actualPhones.length ? (
        <>
          <ul
            className="Cards__list"
            data-cy="productList"
            style={{ gridTemplateColumns: `repeat(${count}, ${itemWidth}px)` }}
          >
            {(visibleItems.length > 0 ? visibleItems : actualPhones).map(
              phone => (
                <li className="Cards__item" key={phone.name}>
                  <ProductCard card={phone} />
                </li>
              ),
            )}
          </ul>

          {perPage === OptionsType.All ? null : (
            <Pagination
              total={total}
              perPage={perPage}
              currentPage={+currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="Cards__list">Nothing found</div>
      )}
    </div>
  );
};
