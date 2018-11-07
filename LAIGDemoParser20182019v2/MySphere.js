function foo(input, max) // If input is greater than max then returns max instad of input. This function aids with calculating indices of the solid. If the indice is bigger than the number of vertices then it returns the last vertice.
{
    if (input > max)
        return max;
    else
        return input;
}
 
class Sphere extends CGFobject
{
    constructor(scene, radius, slices, stacks)
    {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
 
        this.initBuffers();
    }
 
    initBuffers()
    {
        var alpha = 2*Math.PI/this.slices;
 
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
 
        for (var j = 0; j < this.stacks; j++)
        {
            for (var i = 0; i < this.slices; i++)
            {
                this.vertices.push(Math.cos(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)), Math.sin(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)), j/this.stacks);              // A
 
                if (j == this.stacks -1)
                {
                    this.indices.push(foo((0 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); this.indices.push(foo((1 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); this.indices.push(foo((1 + i)%(this.slices) + (j+1)*this.slices, this.slices*this.stacks)); // ACB
                }
                else
                {
                    this.indices.push(foo((0 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); this.indices.push(foo((1 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); this.indices.push(foo((1 + i)%(this.slices) + (j+1)*this.slices, this.slices*this.stacks)); // ACB
                    this.indices.push(foo((0 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); this.indices.push(foo((1 + i)%(this.slices) + (j+1)*this.slices, this.slices*this.stacks)); this.indices.push(foo((0 + i)%(this.slices) + (j+1)*this.slices, this.slices*this.stacks)); // BCD
                }
 
                this.normals.push(Math.cos(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)), Math.sin(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)), j/this.stacks);   // Vector from center (0,0,0) to P(x,y,z) is (x,y,z), therefore equal to the point it is applied to.
                this.texCoords.push((Math.cos(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)) + 1)/2, (-Math.sin(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)) + 1)/2);
 
            }
           
 
        }
 
        this.vertices.push(0,0,1); // Center
        this.normals.push(0,0,1); // Center
        this.texCoords.push(0.5, 0.5);
       
       
        //Lower-half
       
        var indicesLength = (this.vertices.length)/3;
 
        for (var j = 0; j < this.stacks; j++)
        {
            for (var i = 0; i < this.slices; i++)
            {
                this.vertices.push(Math.cos(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)), Math.sin(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)), -j/this.stacks);             // A
 
                if (j == this.stacks - 1)
                {
                    this.indices.push(indicesLength + foo((0 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); this.indices.push(indicesLength + foo((1 + i)%(this.slices) + (j+1)*this.slices, this.slices*this.stacks)); this.indices.push(indicesLength + foo((1 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); // ACB
                }
                else
                {
                    this.indices.push(indicesLength + foo((0 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); this.indices.push(indicesLength + foo((1 + i)%(this.slices) + (j+1)*this.slices, this.slices*this.stacks)); this.indices.push(indicesLength + foo((1 + i)%(this.slices) + j*this.slices, this.slices*this.stacks));// ACB
                    this.indices.push(indicesLength + foo((0 + i)%(this.slices) + j*this.slices, this.slices*this.stacks)); this.indices.push(indicesLength + foo((0 + i)%(this.slices) + (j+1)*this.slices, this.slices*this.stacks)); this.indices.push(indicesLength + foo((1 + i)%(this.slices) + (j+1)*this.slices, this.slices*this.stacks));// BCD
                }
 
                this.normals.push(Math.cos(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)), Math.sin(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)), -j/this.stacks);  // Vector from center (0,0,0) to P(x,y,z) is (x,y,z), therefore equal to the point it is applied to.
                this.texCoords.push((Math.cos(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)) + 1)/2, (-Math.sin(alpha*i)*Math.sqrt(1 - Math.pow(j/this.stacks,2)) + 1)/2);
 
            }
           
        }
 
        this.vertices.push(0,0,-1); // Center
        this.normals.push(0,0,-1); // Center
        this.texCoords.push(0.5, 0.5);
       
        this.primitiveType=this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateTextCoords(length_s, length_t){
        
    };
 
}