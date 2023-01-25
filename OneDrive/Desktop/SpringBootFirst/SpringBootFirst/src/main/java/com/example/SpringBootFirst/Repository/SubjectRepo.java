package com.example.SpringBootFirst.Repository;

import org.springframework.data.repository.CrudRepository;

import com.example.SpringBootFirst.Bean.Subject;

public interface SubjectRepo extends CrudRepository<Subject,String>{

	Iterable<Subject> findAll();

	//Iterable<Subject> findAll();

	
}
