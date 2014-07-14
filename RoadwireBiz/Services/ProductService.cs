using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RoadwireBiz.Models;
using Costco.Data;

namespace RoadwireBiz
{
    public interface ICcProductService
    {
        IEnumerable<CcProductModel> Listing();
        void Update(int id, string description, decimal price);
    }

    public class CcProductService : ICcProductService
    {
        private CostcoEntities _costcoEntities;

        public CcProductService(CostcoEntities costcoEntities)
        {
            _costcoEntities = costcoEntities;
        }

        public IEnumerable<CcProductModel> Listing()
        {
            var prods = from p in _costcoEntities.CostcoProducts
                        select new CcProductModel
                        {
                            ID = p.ID,
                            Code = p.Code,
                            Description = p.Description,
                            Price = p.Price,
                            LeatherRows = p.LeatherRows,
                            Heaters = p.SeatHeaters
                        };

            return prods;
        }

        public void Update(int id, string description, decimal price)
        {
            var prod = (from p in _costcoEntities.CostcoProducts
                        where p.ID == id
                        select p).FirstOrDefault();

            if (prod != null)
            {
                prod.Description = description;
                prod.Price = price;

                _costcoEntities.SaveChanges();
            }
        }
    }
}