package practice;

final public class Student {
	
	private int id;
	private String studentName;
	
	public Student(int id, String studentName) {
		this.id = id;
		this.studentName = studentName;
	}
	
	
	@Override
	public String toString() {
		return "Student [id=" + id + ", studentName=" + studentName + "]";
	}
	
	
	

}
