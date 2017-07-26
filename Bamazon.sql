-- @author: Omar Kaif
-- @github: okaif90
-- @comment: Homework 12 - Bamazon SQL and Node app

-- Database Creation
drop database if exists Bamazon;
create database Bamazon;
use Bamazon;-- ============================ First Table ============================

create table products(
item_id integer auto_increment primary key,
product_name varchar(50) null,
department_name varchar(50) null,
price integer(10),
stock_quantity integer
);

-- ============================ Seed Data ============================

insert into products(product_name, department_name, price, stock_quantity)
values ("Chicken", "Meat", 6.99, 10), 
("Hummus", "Spreads", 5.99, 5),
("Protein Powder", "Health", 39.99, 15),
("Eggs", "Dairy", 4.99, 12),
("Bread", "Snacks", 2.99, 20),
("Milk", "Dairy", .99, 10),
("Ribs", "Meat", 15.99, 6),
("Rice Cakes", "Snacks", 8.99, 8),
("Water", "Beverages", .50, 100),
("Juice", "Beverages", 1.99, 3);